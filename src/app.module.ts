import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './config/Configuration'; 
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration]
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule to access configuration settings
      useFactory: (configService: ConfigService) => ({ // Define a factory function to create the TypeORM connection options
        type: 'postgres', // Specify the type of database (PostgreSQL)
        host: configService.get('database.host'), // Get the database host from configuration
        port: +configService.get<number>('database.port'), // Get the database port from configuration
        username: configService.get('database.username'), // Get the database username from configuration
        password: configService.get('database.password'), // Get the database password from configuration
        database: configService.get('database.name'), // Get the database name from configuration
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Specify the entities (database models) to be used by TypeORM
        synchronize: true, // Automatically synchronize database schema with entities (not recommended for production)
        keepConnectionAlive: true, // Keep the connection alive even when idle
        timezone: 'UTC', // Specify the timezone for the database connection
        ssl: configService.get('database.ssl'), // Determine if SSL should be enabled based on configuration
        extra: configService.get('database.ssl') ? { // Additional options for SSL configuration if enabled
          ssl: {
            rejectUnauthorized: false // Ignore SSL certificate validation (not recommended for production)
          }
        } : null,
        autoLoadEntities: true // Automatically load entities (models) from the specified path
      }),
      inject: [ConfigService] // Specify dependencies that should be injected into the factory function
    }),
    

    BookModule
  ],
  controllers: [AppController ],
  providers: [AppService ],
})
export class AppModule {}