function CategoryCard({ title, icon }) {
  return (
    <div>
      <img src={icon} width="50" />

      <h3>{title}</h3>
    </div>
  );
}

export default CategoryCard;