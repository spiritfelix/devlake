import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import { Tooltip, Position, FormGroup, InputGroup, Button, TextArea, Intent } from '@blueprintjs/core'
import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs/promises'
import { existsSync } from 'fs'
import Nav from '../../components/Nav'
import Sidebar from '../../components/Sidebar'
import Content from '../../components/Content'
import SaveAlert from '../../components/SaveAlert'

export default function Home(props) {
  const { env } = props

  const [alertOpen, setAlertOpen] = useState(false)
  const [jiraEndpoint, setJiraEndpoint] = useState(env.JIRA_ENDPOINT)
  const [jiraBasicAuthEncoded, setJiraBasicAuthEncoded] = useState(env.JIRA_BASIC_AUTH_ENCODED)
  const [jiraIssueEpicKeyField, setJiraIssueEpicKeyField] = useState(env.JIRA_ISSUE_EPIC_KEY_FIELD)
  const [jiraIssueTypeMapping, setJiraIssueTypeMapping] = useState(env.JIRA_ISSUE_TYPE_MAPPING)
  const [jiraIssueBugStatusMapping, setJiraIssueBugStatusMapping] = useState(env.JIRA_ISSUE_BUG_STATUS_MAPPING)
  const [jiraIssueIncidentStatusMapping, setJiraIssueIncidentStatusMapping] = useState(env.JIRA_ISSUE_INCIDENT_STATUS_MAPPING)
  const [jiraIssueStoryStatusMapping, setJiraIssueStoryStatusMapping] = useState(env.JIRA_ISSUE_STORY_STATUS_MAPPING)
  const [jiraIssueStoryCoefficient, setJiraIssueStoryCoefficient] = useState(env.JIRA_ISSUE_STORYPOINT_COEFFICIENT)
  const [jiraIssueStoryPointField, setJiraIssueStoryPointField] = useState(env.JIRA_ISSUE_STORYPOINT_FIELD)

  function updateEnv(key, value) {
    fetch(`/api/setenv/${key}/${encodeURIComponent(value)}`)
  }

  function saveAll(e) {
    e.preventDefault()
    updateEnv('JIRA_ENDPOINT', jiraEndpoint)
    updateEnv('JIRA_BASIC_AUTH_ENCODED', jiraBasicAuthEncoded)
    updateEnv('JIRA_ISSUE_EPIC_KEY_FIELD', jiraIssueEpicKeyField)
    updateEnv('JIRA_ISSUE_TYPE_MAPPING', jiraIssueTypeMapping)
    updateEnv('JIRA_ISSUE_BUG_STATUS_MAPPING', jiraIssueBugStatusMapping)
    updateEnv('JIRA_ISSUE_INCIDENT_STATUS_MAPPING', jiraIssueIncidentStatusMapping)
    updateEnv('JIRA_ISSUE_STORY_STATUS_MAPPING', jiraIssueStoryStatusMapping)
    updateEnv('JIRA_ISSUE_STORYPOINT_COEFFICIENT', jiraIssueStoryCoefficient)
    updateEnv('JIRA_ISSUE_STORYPOINT_FIELD', jiraIssueStoryPointField)
    setAlertOpen(true)
  }

  return (
    <div className={styles.container}>

      <Head>
        <title>Devlake Config-UI</title>
        <meta name="description" content="Lake: Config" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;600&display=swap" rel="stylesheet" />
      </Head>

      <Nav />
      <Sidebar />
      <Content>
        <main className={styles.main}>

          <div className={styles.headlineContainer}>
            <h2 className={styles.headline}>Jira Plugin</h2>
            <p className={styles.description}>Jira Account and config settings</p>
          </div>

          <form className={styles.form}>

            <div className={styles.headlineContainer}>
              <h3 className={styles.headline}>URL Endpoint</h3>
              <p className={styles.description}>The custom endpoint URL for your Jira project</p>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Endpoint&nbsp;URL"
                inline={true}
                labelFor="jira-endpoint"
                helperText="JIRA_ENDPOINT"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <InputGroup
                  id="jira-endpoint"
                  placeholder="Enter Jira endpoint eg. https://merico.atlassian.net"
                  defaultValue={jiraEndpoint}
                  onChange={(e) => setJiraEndpoint(e.target.value)}
                  className={styles.input}
                />
              </FormGroup>
            </div>

            <div className={styles.headlineContainer}>
              <h3 className={styles.headline}>API Token</h3>
              <p className={styles.description}>Your Jira specific API auth token. Should be encoded using command: <br/><br/><code>{`echo -n `}<b>{`<jira login email>`}</b>:<b>{`<jira token>`}</b>{` | base64`}</code></p>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Basic&nbsp;Auth&nbsp;Token"
                inline={true}
                labelFor="jira-basic-auth"
                helperText="JIRA_BASIC_AUTH_ENCODED"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <InputGroup
                  id="jira-basic-auth"
                  placeholder="Enter Jira Auth eg. EJrLG8DNeXADQcGOaaaX4B47"
                  defaultValue={jiraBasicAuthEncoded}
                  onChange={(e) => setJiraBasicAuthEncoded(e.target.value)}
                  className={styles.input}
                />
              </FormGroup>
            </div>

            <div className={styles.headlineContainer}>
              <h3 className={styles.headline}>Status Mappings</h3>
              <p className={styles.description}>Map your custom Jira status to the correct values</p>
            </div>

            <div className={styles.formContainer}>
                <FormGroup
                  label="Issue&nbsp;Type"
                  inline={true}
                  labelFor="jira-issue-type-mapping"
                  helperText="JIRA_ISSUE_TYPE_MAPPING"
                  className={styles.formGroup}
                  contentClassName={styles.formGroup}
                >
                  <Tooltip content="Map your custom type to Devlake standard type" position={Position.TOP}>
                    <InputGroup
                      id="jira-issue-type-mapping"
                      placeholder="STANDARD_TYPE_1:ORIGIN_TYPE_1,ORIGIN_TYPE_2;STANDARD_TYPE_2:....
      "
                      defaultValue={jiraIssueTypeMapping}
                      onChange={(e) => setJiraIssueTypeMapping(e.target.value)}
                      className={styles.input}
                    />
                  </Tooltip>
                </FormGroup>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Issue&nbsp;Bug"
                inline={true}
                labelFor="jira-bug-status-mapping"
                helperText="JIRA_ISSUE_BUG_STATUS_MAPPING"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <Tooltip content="Map your custom bug status to Devlake standard status" position={Position.TOP}>
                  <InputGroup
                    id="jira-bug-status-mapping"
                    placeholder="<STANDARD_STATUS_1>:<ORIGIN_STATUS_1>,<ORIGIN_STATUS_2>;<STANDARD_STATUS_2>"
                    defaultValue={jiraIssueBugStatusMapping}
                    onChange={(e) => setJiraIssueBugStatusMapping(e.target.value)}
                    className={styles.input}
                  />
                </Tooltip>
              </FormGroup>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Issue&nbsp;Incident"
                inline={true}
                labelFor="jira-incident-status-mapping"
                helperText="JIRA_ISSUE_INCIDENT_STATUS_MAPPING"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <Tooltip content="Map your custom incident status to Devlake standard status" position={Position.TOP}>
                <InputGroup
                  id="jira-incident-status-mapping"
                  placeholder="<STANDARD_STATUS_1>:<ORIGIN_STATUS_1>,<ORIGIN_STATUS_2>;<STANDARD_STATUS_2>"
                  defaultValue={jiraIssueIncidentStatusMapping}
                  onChange={(e) => setJiraIssueIncidentStatusMapping(e.target.value)}
                  className={styles.input}
                />
                </Tooltip>
              </FormGroup>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Issue&nbsp;Story"
                inline={true}
                labelFor="jira-story-status-mapping"
                helperText="JIRA_ISSUE_STORY_STATUS_MAPPING"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <Tooltip content="Map your custom story status to Devlake standard status" position={Position.TOP}>
                  <InputGroup
                    id="jira-story-status-mapping"
                    placeholder="<STANDARD_STATUS_1>:<ORIGIN_STATUS_1>,<ORIGIN_STATUS_2>;<STANDARD_STATUS_2>"
                    defaultValue={jiraIssueStoryStatusMapping}
                    onChange={(e) => setJiraIssueStoryStatusMapping(e.target.value)}
                    className={styles.input}
                  />
                </Tooltip>
              </FormGroup>
            </div>

            <div className={styles.headlineContainer}>
              <h3 className={styles.headline}>Additional Customization Settings</h3>
              <p className={styles.description}>Additional Jira settings</p>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Issue&nbsp;Epic&nbsp;Key&nbsp;Field"
                inline={true}
                labelFor="jira-epic-key"
                helperText="JIRA_ISSUE_EPIC_KEY_FIELD"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <Tooltip content="Your custom epic key field (optional)" position={Position.TOP}>
                  <InputGroup
                    id="jira-epic-key"
                    placeholder="Enter Jira epic key field"
                    defaultValue={jiraIssueEpicKeyField}
                    onChange={(e) => setJiraIssueEpicKeyField(e.target.value)}
                    className={styles.input}
                  />
                </Tooltip>
              </FormGroup>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Issue&nbsp;Storypoint&nbsp;Coefficient"
                inline={true}
                labelFor="jira-storypoint-coef"
                helperText="JIRA_ISSUE_STORYPOINT_COEFFICIENT"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <Tooltip content="Your custom story point coefficent (optional)" position={Position.TOP}>
                  <InputGroup
                    id="jira-storypoint-coef"
                    placeholder="Enter Jira Story Point Coefficient"
                    defaultValue={jiraIssueStoryCoefficient}
                    onChange={(e) => setJiraIssueStoryCoefficient(e.target.value)}
                    className={styles.input}
                  />
                </Tooltip>
              </FormGroup>
            </div>

            <div className={styles.formContainer}>
              <FormGroup
                label="Issue&nbsp;Storypoint&nbsp;Field"
                inline={true}
                labelFor="jira-storypoint-field"
                helperText="JIRA_ISSUE_STORYPOINT_FIELD"
                className={styles.formGroup}
                contentClassName={styles.formGroup}
              >
                <Tooltip content="Your custom story point key field (optional)" position={Position.TOP}>
                  <InputGroup
                    id="jira-storypoint-field"
                    placeholder="Enter Jira Story Point Field"
                    defaultValue={jiraIssueStoryPointField}
                    onChange={(e) => setJiraIssueStoryPointField(e.target.value)}
                    className={styles.input}
                  />
                </Tooltip>
              </FormGroup>
            </div>

            <Button type="submit" outlined={true} large={true} className={styles.saveBtn} onClick={saveAll}>Save Config</Button>

          </form>

          <SaveAlert alertOpen={alertOpen} onClose={() => setAlertOpen(false)} />
        </main>
      </Content>
    </div>
  )
}

export async function getStaticProps() {

  const filePath = process.env.ENV_FILEPATH || path.join(process.cwd(), 'data', '../../../.env')
  const exist = existsSync(filePath);
  if (!exist) {
    return {
      props: {
        env: {},
      }
    }
  }
  const fileData = await fs.readFile(filePath)
  const env = dotenv.parse(fileData)

  return {
    props: {
      env
    },
  }
}