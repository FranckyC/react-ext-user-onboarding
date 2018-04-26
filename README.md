# SharePoint Framework External Users Onboarding Web Part #

## Summary
This sample shows you how to build an user friendly Web Part to demistify the external user onboarding process in SharePoint.

<p align="center">
  <img src="./images/todo.gif"/>
</p>


## Used SharePoint Framework Version 
![drop](https://img.shields.io/badge/drop-1.4.1-green.svg)

## Applies to

* [SharePoint Framework](https:/dev.office.com/sharepoint)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)

## Solution

Solution|Author(s)
--------|---------
react-ext-users-onboarding | Franck Cornu (MVP Office Development at aequos) [@FranckCornu](http://www.twitter.com/FranckCornu) <br/>Denis Morielli (SharePoint Solution Architect at CGI)

## Version history

Version|Date|Comments
-------|----|--------
1.0 | TBD | Initial release

## Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Prerequisites

- Install [Azure RM PowerShell Module](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-5.7.0)
- Install [Azure PowerShell Module](https://docs.microsoft.com/en-us/powershell/azure/servicemanagement/install-azure-ps?view=azuresmps-4.0.00)
- Install [Azure AD PowerShell Module](https://docs.microsoft.com/fr-ca/powershell/azure/active-directory/install-adv2?view=azureadps-2.0)

## Minimal Path to Awesome

<h2>The ARM section contains:</h2>
<p>
The ARM repository contains the following files in order to deploy the Azure components.
  <ul>
    <li>A Dedicated Resources Group</li>
    <li>An App Service Plan (we use a Consumption Plan)</li>
    <li>A Storage Account</li>
    <li>A Function App</li>
  </ul>
Set parameters according to your environment using the <i>deployment-params.json</i> file.<br>
Execute the <i>deploy-arm.ps1</i> PowerShell script to launch the deployement.<br>
Note: The Azure Account used for the deployment must be an Organizational Account (and probably also a Cloud Account - not tested) but not a Microsoft Account.
</p>
<p>
The following configuration is applied:
[TODO]
</p>