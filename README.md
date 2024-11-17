# Movies Freak Server

This project is the server of the `Movies Freak` app, It is made with express, typescript, postgresql and love, so be nice and have fun. :) <3

## Setup
Movies Freak Server has been created using **webpack-cli**, you can now run

```sh
yarn  build
```
to bundle the app

### Requirements

Before setting or making any configuration, we first need to install the following dependencies (in case you don't have them).

To install posgresql:

```sh
$ brew install postgresql@14
```

To install node is a little less complex

```sh
brew install yarn # Package manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash # Node Version Manager
nvm install v20.10.0 # Node Package Manager
nvm use v20.10.0
```

To install all dependencies (including typescript)

```sh
yarn
```

### Configuration Files
Movies Freak Server uses dotenv for the config files, so we need to have the environment of the configuration we need. The env file should have the name of the environment so make sure you replace the {environment} with the environment for which you want to create the file.

```sh
cp sample.env .env/{environment}.env
```

## Tests

We have our own test framework called `Classpuccino`, you can find it on the `jesusx21` module.
To create a test you just need to create a file with the extension `.test.ts` and export a class that extends from the Classpuccion Test Case.

We already have a Class that extends from Classpuccino TestCase with some test helpers, you just need to extends from this class in order to use this helpers

Don't forget to add the sufix `Test` to your test class and the prefix `test` for your test function otherwise Classpuccino will think it's not a test class/function.

#### Test Helper

- **createSandbox(): void** Creates a sandbox to easily create mocks, stubs and spies.
- **generateUUID(): UUID** Returns a random uuid.
- **getDatabase(): Promise<MemoryDatabase>** Returns an instances of the database for memory.
- **mockClass(klass: Class, functionType?: string): Mock** Creates a mock with sandbox for the class received with the help of sinon.sandbox.
- **mockDate(year: number, month: number, day: number): FakeTimer** Creates a mock for the date received with the help of sinon.sandbox.
- **mockFunction(instance: any, functionName: string): SinonStub** Mocks the function received of the instance received with the help of sinon.sandbox.
- **restoreSandbox: void** Restores all mocks, stubs and spies created and detaches the previously created sandbox.
- **stubFunction(instance: any, functionName: string): SinonStub** Stubs the function received of the instance received with the help of sinon.sandbox.

#### SQL Test Helper
For the sql tests we have available the previously mentioned helpers along wiht the following

- **getDatabaseConnection(): Knex** Creates a connection to the postgres database with the config on the knexfile.
- **getDatabase(): Promise<SQLDatabase>** Returns an instances of the database for postgres.
- **cleanDatabase: Promise<void>** Drops the database and destroy the current connection.
