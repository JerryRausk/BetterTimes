# Vue 3 + TypeScript + Vite

## Get started with vercel dev cli

Install vercel CLI
```
npm i -g vercel@latest
```

Run project (with hot reload)
```
vercel dev
```

## Use prisma (and prisma client in frontend)
### Generate new client schemas from definitions in prisma/schema.prisma
```
npx prisma generate
```

### Connect to DB
#### Add a .env file that contains DATABASE_URL
``` env
DATABASE_URL='mysql://USERNAME:PASSWORD@SERVER_NAME/DB_NAME'
```

#### Push current state of models to db
```
npx prisma db push
```

### Use prisma schema in frontend when fetching data
```
import type { NameOfTypeFromPrismaSchema } from "@prisma/client";

const res = await fetch("/api/endpoint");
const data: NameOfTypeFromPrismaSchema = await res.json();
console.log(NameOfTypeFromPrismaSchema.NameOfProperty); // NameOfProperty is typesafe
```

### Use prisma schema in backend when fetching from db
```
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const thingFromDB = prisma.NameOfTypeFromPrismaSchema.findUnique({where: {NameOfProperty: valueToFind}});
return response.status(200).send(list);
```

