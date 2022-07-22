# <abbr title="Proof of concept">POC</abbr> for bidirectional communication between an embedded Superset dashboard and its parent/hosting application

(This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).)

## Overview

This project exists by client request to ~~explore the limits of bidirectional communication between an `<iframe/>`-embedded Superset dashboard and the hosting application in which it is embedded.~~ (**UPDATE: As the <abbr title="Proof of concept">POC</abbr> developed, a new goal was identified-- creating a POC of allowing request of a chart permalink from the host application to the embedded `<iframe>` using the Superset-idiomatic approach of leveraging the [Superset `Switchboard`](https://github.com/apache/superset/blob/cb2ffa530f79033716fd719f6798eec049a4dd57/superset-frontend/packages/superset-ui-switchboard/src/switchboard.ts)**).  Per the client's wishes, this is stored in this public repo on my personal Github.  It is intended to be used in conjunction with [its sister application: a forked Superset repo modified to interact with this repo](https://github.com/anied/superset-iframe-poc-embedded-app/tree/iframe-poc-changes).

Please note:

- This <abbr title="Proof of concept">POC</abbr> has been verified to work on MacOS and Ubuntu; Windows is thus far **_untested_**
- This <abbr title="Proof of concept">POC</abbr> has been verified to work with a Superset installation directly to the filesystem; doing a docker-based install is **_untested_**

## Getting started

### Setup

#### **Setup the sister application**

This repo is intended to be used in conjunction with a modified Superset fork.

1. Clone [the modified Superset fork](https://github.com/anied/superset-iframe-poc-embedded-app/tree/iframe-poc-changes) locally:

    `git clone https://github.com/anied/superset-iframe-poc-embedded-app.git`
1. Checkout the modified branch ([`iframe-poc-changes-switchboard-test`](https://github.com/anied/superset-iframe-poc-embedded-app/tree/iframe-poc-changes-switchboard-test):

    `git checkout iframe-poc-changes-switchboard-test`

1. Install Superset (back end and front end) on your machine

    **NOTE:** This <abbr title="Proof of concept">POC</abbr> has been verified to work with a direct installation to the filesystem; doing a docker-based install is **_untested_**
1. Run the backend and front end and log into Superset.
1. Create your own test dashboard for usage in this exercise
1. In the upper-right corner of the dashboard, click the "three-dot" menu and select "Embed Dashboard"

    ![Screenshot of the dashboard menu expanded/open, the "Embed Dashboard" menu option is highlighted](/readme_assets/EmbedDashboardControl.png)
1. Follow the instructions shown in the subsequent modal dialog. Copy the dashboard ID as it will be needed in setting up the parent app.  In the "Allowed Domains" text box, enter the domain on which you intend to run the parent app (`localhost:3000` by default).  Save changes.

    ![Screenshot of the "embed dashboard" modal dialog open, with `localhost:3000` in the "Allowed Domains" field](/readme_assets/EmbedDashboardModal.png)

#### **Setup Superset's `embedded-sdk`**

For this <abbr title="Proof of concept">POC</abbr> it will be necessary to leverage a locally modified version of Superset's `embedded-sdk` (instead of just leveraging the [`embedded-sdk` currently available on NPM](https://www.npmjs.com/package/@superset-ui/embedded-sdk)).  In this step we will build it-- we will actually connect it when we setup the host application (_this_ application) in the subsequent section.

1. In the terminal, inside your cloned Superset fork, navigate to `<YOUR_REPO_ROOT>/superset-embedded-sdk/`
1. Run `npm install` to install dependencies
1. Run `npm run build` to create a distributable build of the codebase

#### **Setup this application**

These are instructions for setting up this, the host application.  Assume all terminal commands occur at the top level of this repo directory unless otherwise noted or directed.

1. Run `npm install` to install dependencies
1. Run `npm link <YOUR_/_PATH_/_TO_/_YOUR_/_LOCAL>/superset-embedded-sdk` to install this dependency from your local (rather than from NPM)

    _(**NOTE:** for reasons not entirely apparent, when `npm link`ing to the local embedded SDK `@superset-ui/switchboard` must be installed as a peer dependency; this is already handled for you in `package.json`.  However, for Production implementations of these concepts, this may not be necessary.)_
1. Open `.env`, it will look roughly like this:

    ```
    REACT_APP_SUPERSET_PORT=8088
    REACT_APP_SUPERSET_PROTOCOL=http
    REACT_APP_SUPERSET_DOMAIN=localhost
    REACT_APP_SUPERSET_FRONT_END_PORT=9000
    REACT_APP_SUPERSET_FRONT_END_PROTOCOL=http
    REACT_APP_SUPERSET_FRONT_END_DOMAIN=localhost
    REACT_APP_SUPERSET_USER=admin
    REACT_APP_SUPERSET_PW=<<<---YOUR_SUPERSET_PASSWORD--->>>
    REACT_APP_SUPERSET_API_PATH=api/v1
    REACT_APP_DASHBOARD_ID=<<<---YOUR_DASHBOARD_ID--->>>
    ```

    These are environment variables that will be accessible inside the running application.  You must replace `REACT_APP_SUPERSET_PW` with your Superset password and `REACT_APP_DASHBOARD_ID` with the ID of your embeddable dashboard.  Make any other salient adjustments you may need to make in this file

### Run the app(s) and verify the result

1. If you are not already running the Superset back end and front end, do so now; log in to Superset in the browser
1. Run `npm start` to start the host app
1. Open the browser to `localhost:3000` (or whatever you set in `.env`).  You should see the host application and your dashboard nested below it (it may take a moment for the dashboard to fully load)

    ![Host app with embedded dashboard-- text is "Superset Bidirectional Communication POC and there is a form beneath it (above the iframe dashboard) titled "Get chart permalink"](/readme_assets/HostAppWithEmbeddedDashboard.png)
1. If you want to get a permalink to a specific chart in the dashboard using the <abbr title="Proof of concept">POC</abbr>, you'll need to get a chart ID for one of your charts.  One way this can be accomplished is opening the dashboard directly in a separate tab and using the Redux tools to pull it out of `state.position_data` (it will look something like this: `CHART-AZiCabB_Xw`).  If you do this, enter the chart ID in the field now.  However, you can also opt to leave the Chart ID input empty and just request a URL for the dashboard itself.  
1. Hit the "Request URL" button
1. After a brief moment, the app should provide you with a generated permalink to the dashboard; verify that this works in another tab

    ![Host app having successfully fetched a URL from the embedded dashboard-- there is an ID entered into the "Chart ID" field and a generated URL is shown below the form; text is "Chart URL is http://localhost:9000/superset/dashboard/p/kpylpGgaKM0/"](/readme_assets/Success.png)

## A few brief words on how this works:

1. Inside of Superset, a few changes are made:
    + Embedded dashboards are enabled
    + The code running in `superset-frontend` is updated so that for embedded dashboards a `getUrlByChartId` method is registered with their [`Switchboard`](https://github.com/apache/superset/blob/cb2ffa530f79033716fd719f6798eec049a4dd57/superset-frontend/packages/superset-ui-switchboard/src/switchboard.ts) in which they fetch a URL and return it through the `Switchboard`
    + The embedded SDK code (which is ultimately run in the context of the host app) creates a `getUrlByChartId` embedded dashboard API method that calls into the iframe using the `Switchboard`
1. Inside of the host app, the dashboard is embedded in such a way that the returned API is cached and piped into the component for the request URL form.  When the "request" button is clicked, it calls the `getUrlByChartId` method and waits for the promise to resolve with the URL.
## A few words on best practices

While some attempt was made to leverage best practices inside the React host app, the ultimate goal was to prove the concepts as requested by the client.  Additionally, very little effort was made to keep the code in the modified Superset fork clean.

Critically, the login/auth flow being used here is inherently insecure and almost certainly not as intended; it was, for the most part, wired up in this way to ease development and avoid needing to go and continuously retrieve a guest token.  **This auth flow should _not_ be recreated verbatim in any deployed environments, _especially_ not in Production and/or customer-facing environments.**

Ultimately, while the concepts are proven in this exercise, do not take for granted that the patterns themselves should be duplicated verbatim; a critical eye to implementation best practices should be taken when reusing this code.