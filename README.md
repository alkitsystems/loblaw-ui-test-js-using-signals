# Instructions
Please read this entire document before beginning your evaluation!

This folder contains one directory for a simple node server (to generate
consistent fake data), and another where you will write your front end React code. Please refer to the Readme files to get yourself started. Outlined below is the business case and objectives for the MVP that you will be creating for this technical evaluation.

Feel free to be creative with this evaluation! Use any additional libraries or technologies that you are comfortable with. If you make certain assumptions
about the design/data/objectives etc., please include comments to describe them so we can see your thought process.

Please return your evaluation as directed and within the time frame specified in the email.

Your submission will be evaluated based on code readability, best practices, style, design, correctness, and efficiency. Thank you, and good luck!

## Business Case
Your company uses external ad servers to manage and run the company’s online advertising campaigns. You are being asked to create an MVP web application (using React) that will provide your stakeholders the ability to view key performance metrics of each campaign.

## MVP Objectives:
1. Build a Campaign List Details
    * API Endpoint: `/api/campaigns`
        * Sample output: 
        ```
        [
            {id: 1, name: "Red"},
            {id: 2, name: "Blue"},
        ] 
        ```
    * Should fetch the campaigns, list their ids and names
    * Clicking either the id or the name should take you to the Dashboard for the campaign (i.e. with cid set to its id)
1. Build a Dashboard to view performance metrics
Details
    * API Endpoint: `/api/campaigns/:cid?number=num`
        1. cid is an id from campaign list
        1. num is an int >= 0
        * Sample output: 
        ```
        { impressions: 40, clicks: 50, users: 87 }
        ```
    * Dashboard should ping the server every 5 seconds to get new data for a given cid (clicked in the list).
    * Start by passing a query param of number=0, and increment it for every ping.
    * Dashboard should include tiles for:
        1. Total Impressions
        1. Total Clicks
        1. CTR - Short for Click Through Rate, calculated ((Total Clicks / Total Impressions) * 100)
        1. Total Users
        1. Current Number (iteration/pull #)
        1. Most Recent Impressions
        1. Most Recent Clicks
        1. Most Recent CTR
        1. Most Recent Users

## MSW Mocking
The API endpoints are already mocked for you using MSW. You will be able to see the data come back when you make a request to the endpoints above. You do not need an active network connection for the API calls to work as it will all work under this Vite application.

## Install all packages
> `npm install`

## Running the Server 
> `npm start`

## Running Unit Tests
> `npm test`
