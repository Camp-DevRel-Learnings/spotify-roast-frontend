export default function Roast (props) {

  const { roast } = props.data;

  return (
  <div>

          <h3 className="title">Spotify Roasts</h3>
          <p className="roast">{roast}</p>

  </div>
  );
};
