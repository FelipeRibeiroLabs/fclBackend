This API was created as a teaching tool and open source so you can see in a practical way how to:

- Connect your backend (javaScript) to the Flow Blockchain using the fcl library;
- Create functions that call Flow Blockchain scripts to retrieve information about the chain;

- Create functions that process backend transactions, such as:
     --Single Signature Transaction
    --Multi-signature transactions (sending a signed message to the frontend) 
    --Backend validations to ensure that the signature sent is really the right transaction for your application 
    
    
In addition, this API connects to a POSTGRES database and stores blockchain information in its database. 

Although the Flow Blockchain stores all information and is very fast at searching, we will use the database to illustrate how it goes about optimising the user experience and storing information that is hard to find on the network, such as events.

To initialise it, clone this repository and execute the command

npm install 

This api requires a connection to a Postgres database. To make the connection, create your .env file following the example of the .env.example file

After you have installed the dependencies and configured your environment variables, you can run the application with the following command

npm run dev

This API is still under development. If you have any suggestions, feel free to open a issue!