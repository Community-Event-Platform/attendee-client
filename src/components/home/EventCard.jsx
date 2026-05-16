function EventCard({ item }) {
  return (
    <div>
      <img src={item.image} width="200" />

      <h3>{item.title}</h3>

      <p>{item.location}</p>

      <button>View Details</button>
    </div>
  );
}

export default EventCard;