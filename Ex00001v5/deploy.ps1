#deploy.ps1
#it builds code
#it zips th code
#it uploads the zip to aws lambda
#it assumes that the lambda function is already created on aws

$FunctionName = "SongsApi"
$ZipFile = "function.zip"

Write-Host "Step 1: Building TypeScript..."
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "Step 2: Creating zip..."
if (Test-Path $ZipFile) {
    Remove-Item $ZipFile
}

# Use built-in Windows tar (works like zip)
#tar -a -c -f $ZipFile dist node_modules
Compress-Archive -Path dist/index.js, dist/services, package.json -DestinationPath function.zip -Force



Write-Host "Step 3: Uploading to AWS Lambda..."
aws lambda update-function-code `
  --function-name $FunctionName `
  --zip-file fileb://$ZipFile

Write-Host "Deployment successful ✅"
