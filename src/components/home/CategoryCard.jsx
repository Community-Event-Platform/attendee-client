import './style/CategoryCard.css';

function CategoryCard({ category, isSelected, onSelect }) {
  return (
    <div
      className={`category-card ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundColor: category.color,
      }}
      onClick={onSelect}
    >
      <div className="category-icon">
        <i className={`bi ${category.icon}`}></i>
      </div>
      <h5 className="category-name">{category.name}</h5>
    </div>
  );
}

export default CategoryCard;
