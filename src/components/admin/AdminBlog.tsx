
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Myth of Steroids in Bodybuilding',
    excerpt: 'Learn why natural bodybuilding is the sustainable path to fitness.',
    content: 'Long form content about natural bodybuilding and its benefits...',
    image: '/blog1.jpg',
    author: 'Sagar Akula',
    date: '2023-10-15',
    category: 'Nutrition'
  },
  {
    id: '2',
    title: 'Best Exercises for Beginners',
    excerpt: 'Starting your fitness journey? Here are the exercises you should focus on.',
    content: 'Detailed guide about beginner exercises...',
    image: '/blog2.jpg',
    author: 'Alex Smith',
    date: '2023-09-22',
    category: 'Training'
  }
];

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: ''
  });
  
  const { toast } = useToast();

  const handleEdit = (post: BlogPost) => {
    setEditing(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      date: post.date,
      category: post.category
    });
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
    toast({
      title: 'Blog post deleted',
      description: 'Blog post has been deleted successfully',
    });
  };

  const handleSave = () => {
    if (editing) {
      setPosts(posts.map(post => 
        post.id === editing ? { ...post, ...formData } : post
      ));
      setEditing(null);
      toast({
        title: 'Blog post updated',
        description: 'Blog post has been updated successfully',
      });
    } else if (isAdding) {
      const newPost = {
        id: Date.now().toString(),
        ...formData
      };
      setPosts([...posts, newPost]);
      setIsAdding(false);
      toast({
        title: 'Blog post added',
        description: 'New blog post has been added successfully',
      });
    }
    
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: ''
    });
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Button onClick={startAdding} className="flex items-center gap-2">
          <Plus size={16} /> Add New Post
        </Button>
      </div>

      {(isAdding || editing) && (
        <div className="bg-rebuild-darkgray p-6 rounded-lg mb-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Blog Post' : 'Edit Blog Post'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input 
                value={formData.image} 
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <Input 
                value={formData.author} 
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <Textarea 
                value={formData.excerpt} 
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelEdit} className="flex items-center gap-2">
              <X size={16} /> Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id}>
              <TableCell>
                <img src={post.image} alt={post.title} className="w-16 h-12 object-cover rounded" />
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminBlog;
