[CmdletBinding()]
Param(
	[Parameter(Mandatory=$True,Position=1)]
	[string]$LogicAppName,
    
    [Parameter(Mandatory=$True)]
	[string]$ResourceGroupName
)

$0 = $myInvocation.MyCommand.Definition
$CommandDirectory = [System.IO.Path]::GetDirectoryName($0)
Push-Location $CommandDirectory

Connect-AzureRmAccount

if ($null -eq (Get-AzureRmResourceGroup -Name $ResourceGroupName -ErrorAction Ignore)) {
    throw "The Resources Group '$ResourceGroupName' doesn't exist."
}
Write-Host "Resource Group Name: $ResourceGroupName" -ForegroundColor Yellow

Write-Host "Deploying LogicApp Template ... " -ForegroundColor Yellow -NoNewline
Push-Location "..\logicapp"
$DeploymentName = "ExternalUserOnboarding-" + ((Get-Date).ToUniversalTime()).ToString("MMdd-HHmm")
$ArmParamsObject = @{"logicAppName" = $LogicAppName;}
$DeploymentOutput = New-AzureRmResourceGroupDeployment -Mode Incremental -Name $DeploymentName -ResourceGroupName $ResourceGroupName -TemplateFile "arm-onboardingchecker.json" -TemplateParameterObject $ArmParamsObject | ConvertTo-Json -Compress
$ArmOutput = $DeploymentOutput | ConvertFrom-Json # COULD BE USEFUL
Write-Host "Done" -ForegroundColor Yellow

$LogicAppEndPoint = (Get-AzureRmLogicAppTriggerCallbackUrl -ResourceGroupName $ResourceGroupName -Name $LogicAppName -TriggerName manual).value
Write-Host "LogicApp EndPoint: $LogicAppEndPoint" -ForegroundColor Yellow
Push-Location $CommandDirectory