if [[ -z $LAMBDA_FUNCTION_NAME ]]; then
  echo "pls set LAMBDA_FUNCTION_NAME to name of function to be updated"
  exit 1
fi

if [[ -z $DIRECTORY ]]; then
  echo "pls set DIRECTORY to location of code"
  exit 1
fi

echo "Updating "$LAMBDA_FUNCTION_NAME" with code in "$DIRECTORY

cd $DIRECTORY

npm run build

rm -rf src
rm -rf test

zip -r lambda-function-code.zip .

aws lambda update-function-code \
    --function-name $LAMBDA_FUNCTION_NAME \
    --zip-file fileb://$(pwd)/lambda-function-code.zip
