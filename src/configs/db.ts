import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "huevang",
    database: "node-ts",
    synchronize: true,
    logging: false,
    entities: ["src/entitys/*.ts"],
    subscribers: [],
    migrations: [],
})