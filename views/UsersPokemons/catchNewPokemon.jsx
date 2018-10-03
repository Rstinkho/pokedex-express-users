var React = require("react");

class newCatch extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
        <h1>What pokemon do u want to grab?</h1>
          <form method="POST" action="/users/addPokemonSuccess">
            <div>
              <p>User ID:<input name="user_id" type="text" /></p>
              <p>Pokemon ID:<input name="pokemon_id" type="text" /></p>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}
 module.exports = newCatch;