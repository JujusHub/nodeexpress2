function sqlForPartialUpdate(table, items, key, id) {
  let idx = 1;
  let columns = [];

  for (let column of Object.keys(items)) {
    if (column.startsWith("_")) {
      delete items[column];
    } else {
      columns.push(`${column}=$${idx}`);
      idx += 1;
    }
  }

  let cols = columns.join(", ");
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;

  let values = Object.values(items);
  values.push(id);

  return { query, values };
}

module.exports = sqlForPartialUpdate;


