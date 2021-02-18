const mysqlConnection = require("./connection");
const express = require("express");
const Joi = require('joi');
const app = express();



var cors = require("cors");
app.use(cors());

app.get("/api/item/:id", (req, res) => {


  
  mysqlConnection.query(
    `SELECT 
            idItems,
            items.name  Items_name,
            items.price  Items_price,
            items.description  Items_description,
            items.photo  Items_photo,
            idModifierList,
            ModifierList.name ModifierList_name,
            ModifierList.min ModifierList_min,
            ModifierList.max ModifierList_max,
            ModifierList.allowMulti ModifierList_allowMulti,
            idModifiers,
            Modifiers.name Modifiers_name,
            Modifiers.price Modifiers_price
            FROM items
            INNER JOIN items_has_modifierlist ON idItems = Items_idItems
            INNER JOIN modifierlist ON ModifierList_idModifierList =idModifierList
            INNER JOIN modifiers ON idModifierList = modifiers.ModifierList_idModifierList
            WHERE  idItems =? 
            `,
    req.params.id,
    (err, rows, fields) => {
      

      console.log(rows);

      if (err) throw err;

      var newItem;
      var newModifierList = [];

      var precIdModifierList = 99;

      for (var i = 0; i < rows.length; i++) {
        var idItems = rows[i].idItems;
        if (!newItem) {
          newItem = {
            idItems: idItems,
            name: rows[i].Items_name,
            description: rows[i].Items_description,
            price: rows[i].Items_price,
            photo: rows[i].Items_photo,
            modifierList: [],
          };
        }

        var idModifierList = rows[i].idModifierList;
        if (!newModifierList[idModifierList]) {
          newModifierList[idModifierList] = {
            idModifierList: rows[i].idModifierList,
            name: rows[i].ModifierList_name,
            min: rows[i].ModifierList_min,
            max: rows[i].ModifierList_max,
            allowMulti: rows[i].ModifierList_allowMulti,
            modifiers: [],
          };
        }

        tempmodifier = {
          idModifiers: rows[i].idModifiers,
          name: rows[i].Modifiers_name,
          price: rows[i].Modifiers_price,
        };

        newModifierList[idModifierList].modifiers.push(tempmodifier);

        newItem.modifierList[idModifierList] = newModifierList[idModifierList];
      }


      
      if (rows.length!=0)
        newItem.modifierList = newItem.modifierList.filter((x) => x !== null);

      res.json(newItem);
    }
  );
});

app.get("/api/menu", (req, res) => {
  mysqlConnection.query(
    `SELECT 
                                categories.idCategories,
                                categories.name Categories_name,
                                items.idItems,
                                items.name Items_name,
                                items.price Items_price,
                                items.description Items_description,
                                items.photo Items_photo
                                FROM categories 
                                INNER JOIN categories_has_items ON idCategories=Categories_idCategories
                                INNER JOIN items ON idItems = Items_idItems`,
                                (err, rows, fields) => {
      if (err) throw err;

      var newMenu = [];

      for (var i = 0; i < rows.length; i++) {
        var idCategories = rows[i].idCategories;

        if (!newMenu[idCategories]) {
          newMenu[idCategories] = {
            idCategories: idCategories,
            name: rows[i].Categories_name,
            items: [],
          };
        }

        tempItems = {
          idItems: rows[i].idItems,
          name: rows[i].Items_name,
          description: rows[i].Items_description,
          photo: rows[i].Items_photo,
          price: rows[i].Items_price,
        };

        newMenu[idCategories].items.push(tempItems);
      }

      newMenu = newMenu.filter((x) => x !== null);

      res.json(newMenu);
    }
  );
});

app.get("/test", (req, res) => {
  console.log(req.baseUrl);
});

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.listen(3002, () => console.log("Listning on port 3002...."));
