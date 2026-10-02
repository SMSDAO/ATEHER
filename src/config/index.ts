export type Environment = "dev" | "staging" | "prod";

export interface AppConfig {
  env: Environment;
  apiUrl: string;
  wsUrl: string;
  features: {
    enableAnalytics: boolean;
    enableAdvancedAI: boolean;
  };
}

const devConfig: AppConfig = {
  env: "dev",
  apiUrl: "http://localhost:3000/api",
  wsUrl: "ws://localhost:3000",
  features: {
    enableAnalytics: false,
    enableAdvancedAI: true,
  },
};

const stagingConfig: AppConfig = {
  env: "staging",
  apiUrl: "https://staging.aether-terminal.com/api",
  wsUrl: "wss://staging.aether-terminal.com",
  features: {
    enableAnalytics: true,
    enableAdvancedAI: true,
  },
};

const prodConfig: AppConfig = {
  env: "prod",
  apiUrl: "https://aether-terminal.com/api",
  wsUrl: "wss://aether-terminal.com",
  features: {
    enableAnalytics: true,
    enableAdvancedAI: true,
  },
};

export const getConfig = (): AppConfig => {
  const currentEnv = import.meta.env.VITE_APP_ENV as Environment || "dev";
  switch (currentEnv) {
    case "prod":
      return prodConfig;
    case "staging":
      return stagingConfig;
    default:
      return devConfig;
  }
};

export const config = getConfig();
