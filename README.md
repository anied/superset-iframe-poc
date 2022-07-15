# <abbr title="Proof of concept">POC</abbr> for bidirectional communication between an embedded Superset dashboard and its parent/hosting application

(This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).)

## Overview

This project exists by client request to explore the limits of bidirectional communication between an `<iframe/>`-embedded Superset dashboard and the hosting application in which it is embedded.  Per the client's wishes, this is stored in this public repo on my personal Github.  It is intended to be used in conjunction with [its sister application: a forked Superset repo modified to interact with this repo](https://github.com/anied/superset-iframe-poc-embedded-app/tree/iframe-poc-changes).

Please note:

- This <abbr title="Proof of concept">POC</abbr> has been verified to work on MacOS and Ubuntu; Windows is thus far **_untested_**
- This <abbr title="Proof of concept">POC</abbr> has been verified to work with a Superset installation directly to the filesystem; doing a docker-based install is **_untested_**

## Getting started

### Setup

#### **Setup the sister application**

This repo is intended to be used in conjunction with a modified Superset fork.

1. Clone [the modified Superset fork](https://github.com/anied/superset-iframe-poc-embedded-app/tree/iframe-poc-changes) locally:

    `git clone https://github.com/anied/superset-iframe-poc-embedded-app.git`
1. Checkout the modified branch ([`iframe-poc-changes`](https://github.com/anied/superset-iframe-poc-embedded-app/tree/iframe-poc-changes)):

    `git checkout iframe-poc-changes`

1. Install Superset (back end and front end) on your machine

    **NOTE:** This <abbr title="Proof of concept">POC</abbr> has been verified to work with a direct installation to the filesystem; doing a docker-based install is **_untested_**
1. Run the backend and front end and log into Superset.
1. Create your own test dashboard for usage in this exercise
1. In the upper-right corner of the dashboard, click the "three-dot" menu and select "Embed Dashboard"

    ![Screenshot of the dashboard menu expanded/open, the "Embed Dashboard" menu option is highlighted](/readme_assets/EmbedDashboardControl.png)
1. Follow the instructions shown in the subsequent modal dialog. Copy the dashboard ID as it will be needed in setting up the parent app.  In the "Allowed Domains" text box, enter the domain on which you intend to run the parent app (`localhost:3000` by default).  Save changes.

    ![Screenshot of the "embed dashboard" modal dialog open, with `localhost:3000` in the "Allowed Domains" field](/readme_assets/EmbedDashboardModal.png)
#### **Setup this application**



1. Run `npm install` to install dependencies
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

1. If you are not already running the Superset back end and front end, do so now; login to Superset in the browser
1. Run `npm start` to start the host app
1. Open the browser to `localhost:3000` (or whatever you set in `.env`).  You should see the host application and your dashboard nested below it

    ![Host app with embedded dashboard-- text is "Superset Bidirectional Communication POC"](/readme_assets/HostAppWithEmbeddedDashboard.png)
1. Click the "Send message to dashboard" button; the console should reflect that the dashboard received the message
1. Click the "Send message to parent" button; the console should reflect that the host frame received the message

## A few words on best practices

While some attempt was made to leverage best practices inside the React host app, the ultimate goal was to prove the concepts as requested by the client.  Additionally, very little effort was made to keep the code in the modified Superset fork clean.

Critically, the login/auth flow being used here is inherently insecure and almost certainly not as intended; it was, for the most part, wired up in this way to ease development and avoid needing to go and continuously retrieve a guest token.  **This auth flow should _not_ be recreated verbatim in any deployed environments, _especially_ not in Production and/or customer-facing environments.**