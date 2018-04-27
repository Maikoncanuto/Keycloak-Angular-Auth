import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';

declare var Keycloak: any;

@Injectable()
export class KeycloakService {

    static auth: any = {};

    /**
     * Initialized keycloak client
     */
    static init(): Promise<any> {
        let keycloakAuth: any = new Keycloak( 'assets/keycloak.json' );
        KeycloakService.auth.loggedIn = false;

        return new Promise(( resolve, reject ) => {
            keycloakAuth.init( { onLoad: 'check-sso' } )
                .success(() => {
                    KeycloakService.auth.loggedIn = true;
                    KeycloakService.auth.authz = keycloakAuth;
                    KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/" + environment.keycloakRealm + "/protocol/openid-connect/logout?redirect_uri=" + environment.baseUrl + "/index.html";

                    resolve();
                } )
                .error(() => {
                    reject();
                } );
        } );
    }

    /**
     * Checks if the login user is a member of the specified group
     * 
     * @param groupName group name defined in keycloak
     */
    static hasGroup( groupName: string ): boolean {
        return KeycloakService.auth.authz != null && KeycloakService.auth.authz.authenticated && KeycloakService.auth.authz.idTokenParsed.groups.indexOf( "/" + groupName ) !== -1 ? true : false;
    }

    /**
     * Checks if the login user is a member of the specified groups
     * 
     * @param groupNames a list of group names defined in keycloak
     */
    static hasGroups( groupNames: string[] ): boolean {
        if ( !groupNames ) {
            return false;
        }
        return groupNames.some( e => {
            if ( typeof e === "string" ) {
                return KeycloakService.hasGroup( e );
            }
        } );
    }

    /**
     * Logout the current user
     */
    static logout() {
        console.log( '*** LOGOUT' );
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;
        console.log( KeycloakService.auth.logoutUrl );
        window.location.href = KeycloakService.auth.logoutUrl;
    }

    /**
     * Redirects to keycloak login page
     */
    static login() {
        KeycloakService.auth.authz.login().success( function() {
            KeycloakService.auth.authz.initPromise.setSuccess();
        } ).error( function() {
            KeycloakService.auth.authz.initPromise.setError();
        } );
    }

    /**
     * Returns the token of the currently logged user
     */
    static getToken(): Promise<string> {
        return new Promise<string>(( resolve, reject ) => {
            if ( KeycloakService.auth.authz.token ) {
                KeycloakService.auth.authz.updateToken( 5 )
                    .success(() => {
                        resolve( <string>KeycloakService.auth.authz.token );
                    } )
                    .error(() => {
                        reject( 'Failed to refresh token' );
                    } );
            }
        } );
    }

    /**
     * Returns true if the current user is logged in
     */
    static isLogged(): boolean {
        return KeycloakService.auth.authz != null && KeycloakService.auth.authz.authenticated;
    }
}