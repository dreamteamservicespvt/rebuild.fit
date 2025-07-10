import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Trash2, Plus, Save, X, Loader2, FileText, Calendar, User, Grid3X3, Table2, Search } from 'lucide-react';
import { blogService, type BlogPost } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AdminFormField from './AdminFormField';
import FormLoadingOverlay from './FormLoadingOverlay';
import AdminLayout from './AdminLayout';
import { AdminTable, TableHeader as AdminTableHeader, TableBody as AdminTableBody, TableHead as AdminTableHead, TableCell as AdminTableCell, TableRow as AdminTableRow, EmptyState, LoadingState } from './AdminTable';
import { DraggableTable } from './DraggableTable';
import AdminActions, { FormActions } from './AdminActions';
import ResponsiveImage from '@/components/ResponsiveImage';
import { Badge } from '@/components/ui/badge';
import AdminBlogCard from './AdminBlogCard';

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: ''
  });
  

  useEffect(() => {
    const unsubscribe = blogService.onSnapshot((postsList) => {
      setPosts(postsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleEdit = (post: BlogPost) => {
    setEditing(post.id!);
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

  const handleDelete = async (id: string) => {
    try {
      await blogService.delete(id);
      toast.success('Blog post deleted', 'Blog post has been deleted successfully');
    } catch (error) {
      toast.error('Error', 'Failed to delete blog post');
    }
  };

  const handleReorder = async (reorderedPosts: BlogPost[]) => {
    try {
      // Optimistically update the UI
      setPosts(reorderedPosts);
      
      // Update the order in Firestore
      await blogService.updateOrder(reorderedPosts.map((post, index) => ({
        ...post,
        id: post.id!,
        order: index
      })));
      
      toast.success('Success', 'Blog posts order has been updated');
    } catch (error) {
      toast.error('Error', 'Failed to update blog posts order');
      
      // Revert to original order on error
      // The real-time listener will restore the correct order
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.author) {
      toast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await blogService.update(editing, formData);
        setEditing(null);
        toast.success('Blog post updated', 'Blog post has been updated successfully');
      } else if (isAdding) {
        await blogService.create(formData);
        setIsAdding(false);
        toast.success('Blog post added', 'New blog post has been added successfully');
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
    } catch (error) {
      toast.error('Error', editing ? 'Failed to update blog post' : 'Failed to add blog post');
    } finally {
      setSaving(false);
    }
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

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      (post.category && post.category.toLowerCase().includes(query)) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <AdminLayout 
        title="Manage Blog Posts" 
        description="Create and manage blog posts for your fitness website"
        isLoading={true}
      >
        <LoadingState message="Loading blog posts..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Manage Blog Posts" 
      description="Create and manage blog posts for your fitness website"
      actions={
        <div className="flex items-center gap-2 xs:gap-3">
          {/* Search Input - Full width on mobile */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 blog-search-icon" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-rebuild-darkgray/50 border-gray-600 text-white placeholder-gray-400 h-8 xs:h-10 text-sm xs:text-base blog-search-input"
              />
            </div>
          </div>

          {/* View Mode Toggle - Hidden on mobile, shown on desktop when data exists */}
          {filteredPosts.length > 0 && !isAdding && !editing && (
            <div className="hidden sm:flex items-center gap-1 blog-view-mode-buttons">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'h-7 w-7 p-0 blog-view-mode-button',
                  viewMode === 'grid' 
                    ? 'bg-rebuild-yellow text-rebuild-black' 
                    : 'border-gray-600 text-white hover:bg-gray-800'
                )}
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  'h-7 w-7 p-0 blog-view-mode-button',
                  viewMode === 'table' 
                    ? 'bg-rebuild-yellow text-rebuild-black' 
                    : 'border-gray-600 text-white hover:bg-gray-800'
                )}
              >
                <Table2 size={14} />
              </Button>
            </div>
          )}

          <Button onClick={startAdding} className="flex items-center gap-2 bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500 h-8 xs:h-10 px-2 xs:px-4 text-sm xs:text-base">
            <Plus size={16} /> 
            <span className="hidden xs:inline">Add New Post</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>
      }
      isLoading={loading}
    >
      {(isAdding || editing) && (
        <div className="bg-rebuild-darkgray p-6 rounded-lg mb-6 animate-fade-in relative">
          <FormLoadingOverlay active={saving} text={editing ? "Updating blog post..." : "Adding new blog post..."} />
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Blog Post' : 'Edit Blog Post'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AdminFormField
              id="title"
              label="Title"
              required
              floatingLabel
              animate
              tooltip="Enter a descriptive and engaging title for your blog post"
            >
              <Input 
                id="title"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter blog post title"
                variant="modern"
                icon={<FileText size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="author"
              label="Author"
              required
              floatingLabel
              animate
              tooltip="Name of the author of this blog post"
            >
              <Input 
                id="author"
                value={formData.author} 
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Enter author name"
                variant="modern"
                icon={<User size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="category"
              label="Category"
              floatingLabel
              animate
              tooltip="The category this blog post belongs to"
            >
              <Input 
                id="category"
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Nutrition, Training"
                variant="modern"
              />
            </AdminFormField>
            
            <AdminFormField
              id="date"
              label="Date"
              floatingLabel
              animate
              tooltip="Publication date for this blog post"
            >
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none z-10">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <Input 
                  id="date"
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="pl-9 border-0 border-b-2 border-gray-700 focus-visible:border-rebuild-yellow bg-transparent rounded-none px-1"
                />
              </div>
            </AdminFormField>
            
            <AdminFormField
              id="excerpt"
              label="Excerpt"
              floatingLabel
              animate
              tooltip="A brief summary that appears in blog listings and previews"
              className="md:col-span-2"
            >
              <Textarea 
                id="excerpt"
                value={formData.excerpt} 
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
                placeholder="Enter a brief excerpt for the blog post"
                className="min-h-[80px] rounded-md border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black"
              />
            </AdminFormField>
            
            <AdminFormField
              id="image"
              label="Featured Image"
              animate
              tooltip="Upload a high-quality image for the blog post"
              className="md:col-span-2"
            >
              <EnhancedImageUpload
                onImageUploaded={handleImageUploaded}
                currentImage={formData.image}
                uploadPath="blog/"
                aspectRatio="landscape"
                previewSize="sm"
                variant="ultra"
                placeholder="Upload blog image"
                maxSizeMB={5}
                className="inline-block"
              />
              {formData.image && (
                <div className="mt-2">
                  <Input 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Or enter image URL"
                    variant="modern"
                  />
                </div>
              )}
            </AdminFormField>
            
            <AdminFormField
              id="content"
              label="Content"
              required
              floatingLabel
              animate
              tooltip="The main content of your blog post"
              className="md:col-span-2"
            >
              <Textarea 
                id="content"
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="min-h-[200px] rounded-md border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black"
                placeholder="Enter the full blog post content"
              />
            </AdminFormField>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelEdit} disabled={saving}>
              <X size={16} className="mr-1" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <Save size={16} className="mr-1" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}

      {!isAdding && !editing && (
        <>
          {filteredPosts.length === 0 ? (
            <EmptyState
              icon={<FileText size={40} />}
              title={searchQuery ? "No Posts Found" : "No Blog Posts Found"}
              description={searchQuery ? `No posts match "${searchQuery}". Try a different search term.` : "Create your first blog post to share insights and tips with your community."}
              action={!searchQuery ? (
                <Button onClick={startAdding} className="flex items-center gap-2 bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500">
                  <Plus size={16} /> Add New Post
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-white"
                >
                  Clear Search
                </Button>
              )}
            />
          ) : (
            <>
              {/* Grid View - Always shown on mobile, toggleable on desktop */}
              <div className={cn(
                "block blog-grid-container",
                "sm:block", // Always show on mobile and small screens
                viewMode === 'grid' ? "sm:block" : "sm:hidden" // Toggle on larger screens
              )}>
                <div className={cn(
                  "grid gap-3 xs:gap-6 blog-card-grid",
                  "grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                  {filteredPosts.map((post) => (
                    <AdminBlogCard
                      key={post.id}
                      post={post}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      disabled={editing !== null || isAdding}
                    />
                  ))}
                </div>
              </div>

              {/* Table View - Hidden on mobile, toggleable on desktop */}
              <div className={cn(
                "hidden blog-table-container",
                viewMode === 'table' ? "sm:block" : "sm:hidden"
              )}>
                <DraggableTable
                  items={filteredPosts}
                  onReorder={(reorderedItems) => handleReorder(reorderedItems as BlogPost[])}
                  headers={['Image', 'Title', 'Author', 'Category', 'Date', 'Actions']}
                  disabled={editing !== null || isAdding}
                  renderRow={(item, isDragging) => {
                    const post = item as BlogPost;
                    return [
                      <AdminTableCell key="image" className="blog-table-cell">
                        {post.image ? (
                          <div className="w-12 xs:w-16 h-8 xs:h-12 rounded overflow-hidden">
                            <ResponsiveImage 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-12 xs:w-16 h-8 xs:h-12 bg-gray-700 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-400" />
                          </div>
                        )}
                      </AdminTableCell>,
                      <AdminTableCell key="title" className="font-medium max-w-[150px] xs:max-w-[200px] truncate text-xs xs:text-sm blog-table-cell">{post.title}</AdminTableCell>,
                      <AdminTableCell key="author" className="hidden xs:table-cell text-xs xs:text-sm blog-table-cell">{post.author}</AdminTableCell>,
                      <AdminTableCell key="category" className="hidden sm:table-cell blog-table-cell">
                        <Badge variant="outline" className="text-xs blog-category-badge">{post.category || 'Uncategorized'}</Badge>
                      </AdminTableCell>,
                      <AdminTableCell key="date" className="hidden md:table-cell text-xs xs:text-sm blog-table-cell">
                        {post.createdAt ? format(post.createdAt.toDate(), 'MMM dd, yyyy') : post.date}
                      </AdminTableCell>,
                      <AdminTableCell key="actions" className="blog-table-cell">
                        <AdminActions 
                          onEdit={() => handleEdit(post)}
                          onDelete={() => handleDelete(post.id!)}
                          disabled={editing !== null || isAdding}
                          itemName={`blog post "${post.title}"`}
                          compact
                        />
                      </AdminTableCell>
                    ];
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;
