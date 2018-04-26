if ($InvocationId) {
    $ErrorActionPreference = "Stop"
}
else {

    Write-Output  " !!! DEBUG CONTEXT !!!"   
   
    # Load root folder and debug config
    if ($PSScriptRoot) {
        $EXECUTION_CONTEXT_FUNCTIONDIRECTORY = Get-Item $PSScriptRoot
    }
    else {
        $EXECUTION_CONTEXT_FUNCTIONDIRECTORY = Get-Item "<your-directory>"
    }

    if ($EXECUTION_CONTEXT_FUNCTIONDIRECTORY) {

        $EXECUTION_CONTEXT_FUNCTIONNAME = $EXECUTION_CONTEXT_FUNCTIONDIRECTORY.Name
        $EXECUTION_CONTEXT_INVOCATIONID = "00000000-0000-0000-0000-000000000000"   
        
        $config = Get-Content -Raw  (join-path -path $EXECUTION_CONTEXT_FUNCTIONDIRECTORY.Parent.FullName -childpath "debug.json") | ConvertFrom-Json

        # Import custom modules
        if ($EXECUTION_CONTEXT_FUNCTIONDIRECTORY.GetDirectories("modules")) {
            $EXECUTION_CONTEXT_FUNCTIONDIRECTORY.GetDirectories("modules").GetFiles() | ? {$_.Extension -eq ".psm1"} | % {        
                Write-Output "Import $($_.FullName)"
                Import-Module $_.FullName -DisableNameChecking -Force -ErrorAction Stop
            }
        }     

        $EXECUTION_CONTEXT_FUNCTIONDIRECTORY = $EXECUTION_CONTEXT_FUNCTIONDIRECTORY.FullName

        # Load Function App settings
        $config.Values | Get-Member | ? {$_.MemberType -eq "NoteProperty"}| % {
            New-Item -Name $_.Name -value $config.Values."$($_.Name)" -ItemType Variable -Path Env:  -Force -ErrorAction Ignore
        }    
    }
    else {
        throw [System.IO.DirectoryNotFoundException] "Working directory not found."
    }
}

# Doesn't work :(
# To get MSOnline work in the Azure Function, you need to set your platform as 64 bits instead of 32 bits
#Connect-MsolService -AdGraphAccessToken ($REQ_HEADERS_AUTHORIZATION -Split " ")[1] -MsGraphAccessToken "" 
#$users = Get-MsolUser

$Response = @{
    "body"= ($REQ_HEADERS_AUTHORIZATION -Split " ")[1]
}

# Return response as JSON
if ($InvocationId) {
    Out-File -Encoding utf8 -FilePath $res -inputObject ($Response | ConvertTo-Json -Depth 4)
} else {
    $Response | ConvertTo-Json -Depth 4
}
