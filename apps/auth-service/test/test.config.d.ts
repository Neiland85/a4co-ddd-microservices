export declare const testConfig: {
    testCredentials: {
        username: string;
        password: string;
        email: string;
    };
    testData: {
        validUser: {
            username: string;
            password: string;
        };
        longUsername: string;
        specialChars: string;
        unicodeUser: string;
        emptyString: string;
        numericInput: string;
    };
    security: {
        minPasswordLength: number;
        maxUsernameLength: number;
        allowedSpecialChars: RegExp;
    };
};
export declare function generateTestCredentials(prefix?: string): {
    username: string;
    password: string;
};
export declare function cleanupTestCredentials(): void;
//# sourceMappingURL=test.config.d.ts.map