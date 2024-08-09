import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPostAkiLoadMod } from "@spt/models/external/IPostAkiLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";


import * as config from "../config.json";

class ModLoader implements IPostAkiLoadMod, IPostDBLoadMod {
    private container: DependencyContainer;

    public postAkiLoad(container: DependencyContainer): void {
        this.container = container;
        const logger = this.container.resolve<ILogger>("WinstonLogger");
        logger.info("Mod: Peacekeepers M855A1 ammos version: 1.0.2 loaded", LogTextColor.YELLOW);
    }

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const dbServer = container.resolve<DatabaseServer>("DatabaseServer");
        const dbTables = dbServer.getTables();

        const peacekeeper = dbTables.traders["5935c25fb3acc3127c3d8cd9"];

        const newAmmoItem = {
            "_id": "M855A1",
            "_tpl": "54527ac44bdc2d36668b4567",
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "StackObjectsCount": 9999999,
                "BuyRestrictionMax": config.buy_restriction_max,
                "BuyRestrictionCurrent": 0
            }
        };

        peacekeeper.assort.items.push(newAmmoItem);

        peacekeeper.assort.barter_scheme["M855A1"] = [
            [
                {
                    "count": config.price,
                    "_tpl": "5696686a4bdc2da3298b456a"
                }
            ]
        ];

        peacekeeper.assort.loyal_level_items["M855A1"] = config.loyalty_level;

        logger.logWithColor("M855A1 ammo added to Peacekeeper.", LogTextColor.GREEN);
    }
}

module.exports = { mod: new ModLoader() };
