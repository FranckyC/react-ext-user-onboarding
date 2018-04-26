# Inspired from the github solution
# https://github.com/InstantQuick/AzureFunctionsForSharePoint

# Requires Azure PowerShell https://github.com/Azure/azure-powershell/releases                                                                                                                                          
Write-Host "***************************" -ForegroundColor Blue
Write-Host " Azure OnboardCheck Assets " -ForegroundColor White
Write-Host " Azure ARM Resources Setup " -ForegroundColor White
Write-Host "***************************" -ForegroundColor Blue

# Import external functions
. .\EnsureAzureAdApp.ps1
# Import input configuration from json configuration file
$devConfig = (Get-Content "deployment-params.json" -Raw) | ConvertFrom-Json
# Set config variables
$tenantName = $devConfig.tenantname
$acctName = $devConfig.azureaccount
$subscriptionId = $devConfig.subscriptionid
$resourceGroupName = $devConfig.resourcegroupname
$resourceGroupLocation = $devConfig.resourcegrouplocation
$deploymentName = $devConfig.deploymentname + '-' + ((Get-Date).ToUniversalTime()).ToString('MMdd-HHmm')

<#
** Need to be confirmed ** :
There is a bug with Login-AzureRmAccount that the account must be a Azure AD account
not an outlook.com or hotmail.com account.  If an account name is not provided, prompt for the user 
to login. See http://stackoverflow.com/questions/39657391/login-azurermaccount-cant-login-to-azure-using-pscredential
#>

if ($devConfig.azureaccount) {
    $acctPwd = Read-Host -Prompt "Enter password" -AsSecureString
    $psCred = New-Object System.Management.Automation.PSCredential($acctName, $acctPwd)
    Write-Host "Using $($psCred.UserName) to login to Azure..."
    $profile = Login-AzureRmAccount -Credential $psCred  -SubscriptionId $subscriptionId
} else {
    $psCred = Get-Credential
    $profile = Login-AzureRmAccount
}

Get-AzureSubscription
Select-AzureRmSubscription -SubscriptionId $subscriptionId
$confirmation = Read-Host "Confirm using subscription above to create $($devConfig.resourcegroupname)? (y/n)"

if ($confirmation.ToLower() -eq "y") {
    #### DEPLOY THE ARM TEMPLATE ####
    # Create the Resource Group which will contain all resources
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
    # Use the resource group, template file, and template parameters to create the resources and create an output
    New-AzureRmResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile "arm-onboardcheck.json" -TemplateParameterFile "arm-parameters.json" | ConvertTo-Json | Out-File "arm-outputs.json"
    $armOutput = (Get-Content "arm-outputs.json" -Raw) | ConvertFrom-Json
    $armOutput.outputs.functionAppName.value

    #### DEPLOY THE AZURE AD APPS ####
    Connect-AzureAD -Credential $psCred

    ## SharePoint KeyVault Azure AD App
    $KvAppIdentifier = "https://$tenantName/91ec1750-8357-47e9-a04c-50a4b32fd5db"
    $KvAppName = "Onboarding Checker Keyvault"
    # delegated permissions for Windows Azure AD
    $req1 = New-Object -TypeName "Microsoft.Open.AzureAD.Model.RequiredResourceAccess"
    $req1.ResourceAppId = "00000002-0000-0000-c000-000000000000"
    $acc1r1 = New-Object -TypeName "Microsoft.Open.AzureAD.Model.ResourceAccess" -ArgumentList "311a71cc-e848-46a1-bdf8-97ff7156d8e6","Scope"
    $req1.ResourceAccess = $acc1r1
    $keyvaultApp = EnsureAzureAdApp -AppIdentifier $KvAppIdentifier -AppName $KvAppName -ReplyURLs @("https://localhost") -RequiredPermissions $req1
    
} else {
    Write-Host "*************************************"
    Write-Host " Skipping creation of resource group "
    Write-Host "*************************************"
}