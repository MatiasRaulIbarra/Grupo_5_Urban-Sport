module.exports = (sequelize, dataTypes) => {
    let alias = "Categories";

    let cols = {
        id: {
            type: dataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: dataTypes.STRING(45),
            allowNull: false
        }
    }
    let config = {
        tableName: "categories",
        timestamps: false
    }

    let Category = sequelize.define(alias, cols, config)

    Category.associate = models => {
        Category.hasMany(models.Subcategories, {
            as: "subcategories",
            foreignKey: "categories_id"
        })
    }
    return Category;
}