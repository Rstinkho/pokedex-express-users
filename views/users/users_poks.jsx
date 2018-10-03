var React = require("react");
 class UsersGrabStupidPokemonWhyWeHaveSoManyAssignmentWithThemReallyStrugglingToGoFurtherBecauseOfThat extends React.Component {
  render() {
    console.log(this);
    return (
      <html>
        <head />
        <body>
          <ul>
            {this.props.pokemons.map(pokemon => (
              <li>
                Grabbed pokemon: {pokemon.name}
              </li>
            ))}
          </ul>
        </body>
      </html>
    );
  }
}
 module.exports = UsersGrabStupidPokemonWhyWeHaveSoManyAssignmentWithThemReallyStrugglingToGoFurtherBecauseOfThat;