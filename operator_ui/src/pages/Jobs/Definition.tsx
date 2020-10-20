import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { v2 } from 'api'
import { ApiResponse } from '@chainlink/json-api-client'
import {
  createStyles,
  CardContent,
  Divider,
  Card,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core'
import Content from 'components/Content'
import PrettyJson from 'components/PrettyJson'
import { JobSpec } from 'core/store/models'
import jobSpecDefinition from 'utils/jobSpecDefinition'
import RegionalNav from './RegionalNav'

const definitionStyles = (theme: Theme) =>
  createStyles({
    definitionTitle: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
    divider: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 3,
    },
  })

const Definition: React.FC<
  RouteComponentProps<{
    jobSpecId: string
  }> &
    WithStyles<typeof definitionStyles>
> = ({ classes, match }) => {
  const { jobSpecId } = match.params

  const [error, setError] = React.useState()
  const [jobSpec, setJobSpec] = React.useState<ApiResponse<JobSpec>['data']>()

  React.useEffect(() => {
    document.title = 'Job Definition'
  }, [])

  React.useEffect(() => {
    v2.specs
      .getJobSpec(jobSpecId)
      .then((response) => setJobSpec(response.data))
      .catch(setError)
  }, [jobSpecId])

  return (
    <div>
      <RegionalNav jobSpecId={jobSpecId} job={jobSpec} />
      <Content>
        <Card>
          {error && (
            <div>Error while fetching data: {JSON.stringify(error)}</div>
          )}
          {!error && !jobSpec && <div>Fetching...</div>}
          {!error && jobSpec && (
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Typography variant="h5" className={classes.definitionTitle}>
                    Definition
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider light className={classes.divider} />
                </Grid>
                <Grid item xs={12}>
                  <PrettyJson
                    object={jobSpecDefinition({
                      ...jobSpec,
                      ...jobSpec.attributes,
                    })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          )}
        </Card>
      </Content>
    </div>
  )
}

export const JobsDefinition = withStyles(definitionStyles)(Definition)
export default JobsDefinition
