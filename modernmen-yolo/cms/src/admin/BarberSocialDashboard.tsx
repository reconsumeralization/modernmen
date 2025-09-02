import React, { useState, useEffect, useCallback } from 'react';
import { BusinessIcons } from './customIcons';

// Types for the social media system
interface BarberPost {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  beforeImage: string;
  afterImage: string;
  additionalImages?: Array<{
    image: string;
    caption?: string;
  }>;
  description: string;
  category: string;
  difficulty: string;
  timeSpent: number;
  tags: string[];
  likes: string[];
  comments: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
    createdAt: string;
  }>;
  rating: {
    averageRating: number;
    totalRatings: number;
  };
  views: number;
  shares: number;
  createdAt: string;
  challenge?: {
    id: string;
    title: string;
    status: string;
  };
}

interface BarberChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  status: string;
  participants: string[];
  prizes: Array<{
    place: string;
    description: string;
    value?: number;
  }>;
  featuredImage?: string;
}

interface BarberStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  averageRating: number;
  followers: number;
  following: number;
  challengeWins: number;
  featuredPosts: number;
}

// Main Dashboard Component
export const BarberSocialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'profile' | 'create'>('feed');
  const [posts, setPosts] = useState<BarberPost[]>([]);
  const [challenges, setChallenges] = useState<BarberChallenge[]>([]);
  const [stats, setStats] = useState<BarberStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
    averageRating: 0,
    followers: 0,
    following: 0,
    challengeWins: 0,
    featuredPosts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'trending' | 'following' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    setPosts([
      {
        id: '1',
        title: 'Epic Fade Transformation',
        author: { id: '1', name: 'Mike the Barber', avatar: '/avatar1.jpg' },
        beforeImage: '/before1.jpg',
        afterImage: '/after1.jpg',
        description: 'Client wanted a high fade with texture on top. This took about 45 minutes and the client was thrilled!',
        category: 'fade',
        difficulty: 'intermediate',
        timeSpent: 45,
        tags: ['fade', 'high-fade', 'texture', 'modern'],
        likes: ['user1', 'user2', 'user3'],
        comments: [
          {
            id: '1',
            content: 'Clean fade! What clipper guard did you use?',
            author: { id: '2', name: 'Sarah Barber' },
            createdAt: '2024-01-15T10:30:00Z',
          },
        ],
        rating: { averageRating: 9.2, totalRatings: 15 },
        views: 1250,
        shares: 23,
        createdAt: '2024-01-15T09:00:00Z',
      },
      // Add more mock posts...
    ]);

    setChallenges([
      {
        id: '1',
        title: 'January Fade Challenge',
        description: 'Show us your best fade work! Open to all skill levels.',
        category: 'fade',
        difficulty: 'all',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'active',
        participants: ['user1', 'user2', 'user3'],
        prizes: [
          { place: '1st Place', description: 'Professional Clipper Set', value: 500 },
          { place: '2nd Place', description: 'Premium Styling Products', value: 250 },
          { place: '3rd Place', description: 'Barber Tools Kit', value: 100 },
        ],
      },
    ]);
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes('currentUser');
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== 'currentUser')
            : [...post.likes, 'currentUser']
        };
      }
      return post;
    }));
  }, []);

  const handleComment = useCallback((postId: string, comment: string) => {
    const newComment = {
      id: Date.now().toString(),
      content: comment,
      author: { id: 'currentUser', name: 'You' },
      createdAt: new Date().toISOString(),
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  }, []);

  const handleShare = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    }));
  }, []);

  const renderPost = (post: BarberPost) => (
    <div key={post.id} className="barber-post">
      <div className="post-header">
        <div className="author-info">
          <img 
            src={post.author.avatar || '/default-avatar.jpg'} 
            alt={post.author.name}
            className="author-avatar"
          />
          <div>
            <h3 className="author-name">{post.author.name}</h3>
            <span className="post-time">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="post-category">
          <span className={`category-badge ${post.category}`}>
            {post.category}
          </span>
        </div>
      </div>

      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-description">{post.description}</p>
        
        <div className="transformation-images">
          <div className="image-comparison">
            <div className="before-after">
              <div className="before">
                <img src={post.beforeImage} alt="Before" />
                <span className="label">Before</span>
              </div>
              <div className="after">
                <img src={post.afterImage} alt="After" />
                <span className="label">After</span>
              </div>
            </div>
          </div>
          
          {post.additionalImages && post.additionalImages.length > 0 && (
            <div className="additional-images">
              {post.additionalImages.map((img, index) => (
                <div key={index} className="additional-image">
                  <img src={img.image} alt={img.caption || `Additional ${index + 1}`} />
                  {img.caption && <span className="caption">{img.caption}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="post-details">
          <div className="detail-item">
            <span className="label">Difficulty:</span>
            <span className={`difficulty-badge ${post.difficulty}`}>
              {post.difficulty}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Time:</span>
            <span>{post.timeSpent} min</span>
          </div>
          <div className="detail-item">
            <span className="label">Rating:</span>
            <span className="rating">
              ⭐ {post.rating.averageRating.toFixed(1)} ({post.rating.totalRatings})
            </span>
          </div>
        </div>

        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        {post.challenge && (
          <div className="challenge-badge">
            🏆 {post.challenge.title}
          </div>
        )}
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${post.likes.includes('currentUser') ? 'liked' : ''}`}
          onClick={() => handleLike(post.id)}
        >
          ❤️ {post.likes.length}
        </button>
        <button className="action-btn comment-btn">
          💬 {post.comments.length}
        </button>
        <button 
          className="action-btn share-btn"
          onClick={() => handleShare(post.id)}
        >
          📤 {post.shares}
        </button>
        <button className="action-btn view-btn">
          👁️ {post.views}
        </button>
      </div>

      <div className="post-comments">
        {post.comments.map(comment => (
          <div key={comment.id} className="comment">
            <span className="comment-author">{comment.author.name}:</span>
            <span className="comment-content">{comment.content}</span>
          </div>
        ))}
        <div className="add-comment">
          <input 
            type="text" 
            placeholder="Add a comment..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleComment(post.id, e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderChallenge = (challenge: BarberChallenge) => (
    <div key={challenge.id} className="challenge-card">
      <div className="challenge-header">
        <h3>{challenge.title}</h3>
        <span className={`status-badge ${challenge.status}`}>
          {challenge.status}
        </span>
      </div>
      
      <div className="challenge-content">
        <p>{challenge.description}</p>
        
        <div className="challenge-details">
          <div className="detail">
            <span className="label">Category:</span>
            <span className="category">{challenge.category}</span>
          </div>
          <div className="detail">
            <span className="label">Difficulty:</span>
            <span className="difficulty">{challenge.difficulty}</span>
          </div>
          <div className="detail">
            <span className="label">Participants:</span>
            <span>{challenge.participants.length}</span>
          </div>
        </div>

        <div className="challenge-prizes">
          <h4>Prizes:</h4>
          {challenge.prizes.map((prize, index) => (
            <div key={index} className="prize">
              <span className="place">{prize.place}</span>
              <span className="description">{prize.description}</span>
              {prize.value && <span className="value">${prize.value}</span>}
            </div>
          ))}
        </div>

        <div className="challenge-dates">
          <div className="date">
            <span className="label">Starts:</span>
            <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
          </div>
          <div className="date">
            <span className="label">Ends:</span>
            <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="challenge-actions">
        <button className="btn btn-primary">Join Challenge</button>
        <button className="btn btn-secondary">View Details</button>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{stats.totalPosts}</div>
        <div className="stat-label">Total Posts</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">❤️</div>
        <div className="stat-value">{stats.totalLikes}</div>
        <div className="stat-label">Total Likes</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">💬</div>
        <div className="stat-value">{stats.totalComments}</div>
        <div className="stat-label">Total Comments</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">👁️</div>
        <div className="stat-value">{stats.totalViews}</div>
        <div className="stat-label">Total Views</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">⭐</div>
        <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
        <div className="stat-label">Average Rating</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <div className="stat-value">{stats.challengeWins}</div>
        <div className="stat-label">Challenge Wins</div>
      </div>
    </div>
  );

  return (
    <div className="barber-social-dashboard">
      <div className="dashboard-header">
        <h1>ModernMen Social Hub</h1>
        <p>Connect, compete, and showcase your barber skills</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          📱 Feed
        </button>
        <button 
          className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          🏆 Challenges
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ✨ Create Post
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'feed' && (
          <div className="feed-section">
            <div className="feed-filters">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">All Posts</option>
                <option value="trending">Trending</option>
                <option value="following">Following</option>
                <option value="category">By Category</option>
              </select>
              
              {filter === 'category' && (
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="all">All Categories</option>
                  <option value="fade">Fade</option>
                  <option value="pompadour">Pompadour</option>
                  <option value="undercut">Undercut</option>
                  <option value="textured-crop">Textured Crop</option>
                  <option value="slick-back">Slick Back</option>
                  <option value="quiff">Quiff</option>
                  <option value="side-part">Side Part</option>
                  <option value="buzz-cut">Buzz Cut</option>
                  <option value="long-hair">Long Hair</option>
                  <option value="braids">Braids</option>
                  <option value="dreadlocks">Dreadlocks</option>
                  <option value="color">Color</option>
                  <option value="highlights">Highlights</option>
                  <option value="other">Other</option>
                </select>
              )}
            </div>

            <div className="posts-grid">
              {posts.map(renderPost)}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-section">
            <div className="challenges-header">
              <h2>Active Challenges</h2>
              <button className="btn btn-primary">Create Challenge</button>
            </div>
            
            <div className="challenges-grid">
              {challenges.map(renderChallenge)}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-header">
              <img src="/default-avatar.jpg" alt="Profile" className="profile-avatar" />
              <div className="profile-info">
                <h2>Your Barber Profile</h2>
                <p>Showcase your skills and build your reputation</p>
              </div>
            </div>
            
            {renderStats()}
            
            <div className="profile-actions">
              <button className="btn btn-primary">Edit Profile</button>
              <button className="btn btn-secondary">View Analytics</button>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-section">
            <h2>Create New Post</h2>
            <p>Share your latest transformation with the community</p>
            
            <div className="create-form">
              <div className="form-group">
                <label>Post Title</label>
                <input type="text" placeholder="Give your post a catchy title..." />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Tell the story of this transformation..."></textarea>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option value="">Select a category</option>
                  <option value="fade">Fade</option>
                  <option value="pompadour">Pompadour</option>
                  <option value="undercut">Undercut</option>
                  <option value="textured-crop">Textured Crop</option>
                  <option value="slick-back">Slick Back</option>
                  <option value="quiff">Quiff</option>
                  <option value="side-part">Side Part</option>
                  <option value="buzz-cut">Buzz Cut</option>
                  <option value="long-hair">Long Hair</option>
                  <option value="braids">Braids</option>
                  <option value="dreadlocks">Dreadlocks</option>
                  <option value="color">Color</option>
                  <option value="highlights">Highlights</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Difficulty Level</label>
                <select>
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time Spent (minutes)</label>
                <input type="number" placeholder="45" />
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <input type="text" placeholder="fade, high-fade, texture, modern" />
                <small>Separate tags with commas</small>
              </div>
              
              <div className="form-group">
                <label>Before Photo</label>
                <input type="file" accept="image/*" />
              </div>
              
              <div className="form-group">
                <label>After Photo</label>
                <input type="file" accept="image/*" />
              </div>
              
              <div className="form-group">
                <label>Additional Photos (Optional)</label>
                <input type="file" accept="image/*" multiple />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  I have permission to share these photos
                </label>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-secondary">Save Draft</button>
                <button className="btn btn-primary">Publish Post</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberSocialDashboard;
