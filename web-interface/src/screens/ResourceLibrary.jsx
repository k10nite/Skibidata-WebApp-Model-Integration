import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, Video, FileText, ExternalLink } from 'lucide-react';
import { resources } from '../data/mockData';

const ResourceLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'fertilizer', label: 'Fertilizer Guide' },
    { value: 'soil', label: 'Soil Management' },
    { value: 'crops', label: 'Crop Care' },
    { value: 'pest', label: 'Pest Control' },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={20} />;
      case 'article':
        return <FileText size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };

  return (
    <motion.div
      className="screen resource-library-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="screen-header">
        <h1 className="screen-title">
          <BookOpen size={32} />
          Resource Library
        </h1>
        <p className="screen-subtitle">
          Learn best practices for farming and fertilizer application
        </p>
      </div>

      {/* Search and Filter */}
      <div className="resource-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <Filter size={20} />
          {categories.map((category) => (
            <button
              key={category.value}
              className={`filter-btn ${
                selectedCategory === category.value ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            className="resource-card"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="resource-image">
              <img src={resource.thumbnail} alt={resource.title} />
              <span className="resource-type-badge">
                {getResourceIcon(resource.type)}
                {resource.type}
              </span>
            </div>

            <div className="resource-content">
              <div className="resource-category">{resource.category}</div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>

              <div className="resource-meta">
                <span className="resource-duration">{resource.duration}</span>
                <span className="resource-level">{resource.level}</span>
              </div>

              <button className="btn btn-text resource-link">
                {resource.type === 'video' ? 'Watch' : 'Read'}
                <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="empty-state">
          <BookOpen size={64} />
          <h3>No resources found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </motion.div>
  );
};

export default ResourceLibrary;
