Function EnsureAzureAdApp {
    [cmdletbinding()]    
    param
    (
        [Parameter(Mandatory = $true)]
        [String] $AppIdentifier,

        [Parameter(Mandatory = $true)]
        [String]$AppName,

        [Parameter(Mandatory = $true)]
        [Collections.Generic.List[String]]$ReplyURLs,

        [Parameter(Mandatory = $true)]
        [Collections.Generic.List[Microsoft.Open.AzureAD.Model.RequiredResourceAccess]]$RequiredPermissions
    )

    $app = Get-AzureADApplication -Filter "identifierUris/any(uri:uri eq '$AppIdentifier')"
    if (!$app) {
        $app = New-AzureADApplication -DisplayName $AppName -IdentifierUris $AppIdentifier
    }
    Set-AzureADApplication -ObjectId $app.ObjectId -ReplyUrls $ReplyURLs -AvailableToOtherTenants $false -IdentifierUris $AppIdentifier -RequiredResourceAccess $RequiredPermissions
    $appid = $app.AppId
    $sp = Get-AzureADServicePrincipal -Filter "AppId eq '$appid'"
    if (!$sp) {
        $sp = New-AzureADServicePrincipal -AccountEnabled $true -AppId $app.AppId -AppRoleAssignmentRequired $true -DisplayName $AppName
    }
    Set-AzureADServicePrincipal -ObjectId $sp.ObjectId -DisplayName $AppName
    return $app
}