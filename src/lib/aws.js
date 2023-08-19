import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "prod/RapifyCloud/GCPVision";
const client = new SecretsManagerClient({
    region: "us-east-1",
});

export async function getGoogleCloudVisionKey() {
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );

        if ('SecretString' in response) {
            const secret = response.SecretString;
            return secret;
        } else {
            console.error("SecretString not found in response:", response);
            throw new Error("Secret value not found");
        }
    } catch (error) {
        console.error("Error retrieving secret:", error);
        throw error;
    }
}
