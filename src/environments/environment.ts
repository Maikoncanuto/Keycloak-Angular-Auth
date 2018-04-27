// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    baseUrl: 'http://localhost:4200',
    production: false,
    apiUrl: 'http://localhost:8280/api/rest',

    keycloakRealm: 'keycloak-auth',
    keycloakBaseUrl: 'http://localhost:8380/',

    imageType:
    {
        'PROMOTER_PROFILE': '/adm/promoter/{id}/profileImage'
    }
};