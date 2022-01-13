var dbConfig = {
    synchronize: false,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir: 'migrations'
    },
}

switch (process.env.NODE_ENV) {
    case 'dev':
        Object.assign(dbConfig, {
            logging: true,
            type: 'postgres',
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ['**/*.entity.js'],
            synchronize: false,
        })
        break;

    case 'test':
        Object.assign(dbConfig, {
            logging: true,
            type: 'postgres',
            port: process.env.DATABASE_PORT,
            host: process.env.DATABASE_HOST,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: ['**/*.entity.ts'],
            synchronize: false,
        })
        break;
    case 'production':
        Object.assign(dbConfig, {
            logging: true,
            type: 'postgres',
            url: process.env.DATABASE_URL,
            port: process.env.DATABASE_PORT,
            host: process.env.DATABASE_HOST,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: ['**/*.entity.js'],
            synchronize: false,
            ssl: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        })
        break;
    default:
        throw new Error("unkonwn environment")
}

module.exports = dbConfig;

//