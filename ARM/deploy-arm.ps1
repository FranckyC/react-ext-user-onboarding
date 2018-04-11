# Inspired from the github solution
# https://github.com/InstantQuick/AzureFunctionsForSharePoint

# Requires Azure PowerShell https://github.com/Azure/azure-powershell/releases                                                                                                                                          
Write-Host "***************************" -ForegroundColor Blue
Write-Host " Azure OnboardCheck Assets " -ForegroundColor White
Write-Host " Azure ARM Resources Setup " -ForegroundColor White
Write-Host "***************************" -ForegroundColor Blue

# Import input configuration from json configuration file
$devConfig = (Get-Content "deployment-params.json" -Raw) | ConvertFrom-Json

$acctName = $devConfig.azureaccount
$subscriptionId = $devConfig.subscriptionid
$resourceGroupName = $devConfig.resourcegroupname
$resourceGroupLocation = $devConfig.resourcegrouplocation
$deploymentName = $devConfig.deploymentname

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
    $profile = Login-AzureRmAccount
}

Get-AzureSubscription
Select-AzureRmSubscription -SubscriptionId $subscriptionId
$confirmation = Read-Host "Confirm using subscription above to create $($devConfig.resourcegroupname)? (y/n)"
if ($confirmation.ToLower() -eq "y") {
    # Create the Resource Group which will contain all resources
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
    # Use the resource group, template file, and template parameters to create the resources
    New-AzureRmResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile "arm-onboardcheck.json" -TemplateParameterFile "arm-parameters.json" | ConvertTo-Json | Out-File "arm-outputs.json"
    $armOutput = (Get-Content "arm-outputs.json" -Raw) | ConvertFrom-Json
    $armOutput.outputs.ConfigurationStorageAccountKey.value
    @{subscriptionid = $subscriptionId;
    storageconnection = $armOutput.outputs.ConfigurationStorageAccountKey.value;
    resourcegroupname = $resourceGroupName;
    functionappname = $armOutput.outputs.FunctionAppName.value;} | ConvertTo-Json | Out-File "deploy.config.json"
} else {
    Write-Host "*************************************"
    Write-Host " Skipping creation of resource group "
    Write-Host "*************************************"
}