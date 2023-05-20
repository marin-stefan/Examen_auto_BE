import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

export class Database {
    dbUri = "mongodb+srv://admin:Utm123@cluster0.rgdx2sf.mongodb.net/?retryWrites=true&w=majority";
    connection = mongoose.connection;

    constructor() {
        try {
            this.connection 
                .on('connected', console.info.bind(console, 'Connectat la Baza de Date'))
                .on('error', console.error.bind(console, 'Eroare conexiune: MongoDB' ))
        } catch (error) {
            console.error(error)
        }
    }

    async connect() {
        try {
            await mongoose.connect(this.dbUri,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    }

    async close() {
        await this.connection.close();
    } catch (error) {
        console.log(error.message);

    }
}

