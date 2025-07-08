import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Download, Search, FileText, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Benchmark {
  id: string; // benchmark_id
  name: string; // title
  version: string; // e.g., v1.6.0
  released: string; // ISO date string
  category: string; // Derived from os_id or metadata
  description: string; // Metadata description or fallback
  downloads: number; // Download count
}

const Benchmarks = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  // Base API URL (adjust to your backend's host/port)
  const API_BASE_URL = 'http://localhost:3000/csv_db/csv_benchmarks/benchmarks';

  useEffect(() => {
    if (!user || !token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to view benchmarks.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    fetchCategories();
    fetchBenchmarks();
  }, [searchTerm, selectedCategory, page, token, user, navigate, toast]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCategories(response.data as string[]);
    } catch (error: any) {
      console.warn('Failed to fetch categories:', error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load categories.',
        variant: 'destructive',
      });
      setCategories(['all']);
    }
  };

  const fetchBenchmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ benchmarks: Benchmark[]; total: number }>(API_BASE_URL, {
        params: {
          search: searchTerm || undefined,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          page,
          pageSize,
        },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setBenchmarks(response.data.benchmarks || []);
      setTotalPages(Math.ceil((response.data.total || 0) / pageSize));
    } catch (error: any) {
      setError('Failed to load benchmarks. Please try again.');
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load benchmarks.',
        variant: 'destructive',
      });
      setBenchmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (benchmark: Benchmark, format: 'pdf' | 'csv' | 'json') => {
    try {
      // Use benchmark.name for the ID, as the backend's getBenchmarkByName uses title or os_id
      const response = await axios.post(
        `${API_BASE_URL}/${encodeURIComponent(benchmark.name)}/download/${format}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          responseType: 'blob',
        }
      );

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes(format)) {
        throw new Error(`Invalid ${format.toUpperCase()} content received`);
      }

      const url = window.URL.createObjectURL(response.data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${benchmark.name.replace(/\s/g, '_')}_v${benchmark.version}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download Successful',
        description: `Downloaded ${benchmark.name} v${benchmark.version} as ${format.toUpperCase()}.`,
      });

      // Refresh benchmarks to update download count
      fetchBenchmarks();
    } catch (error: any) {
      console.error('Download error:', error);
      const message = error.response?.data?.message || `Failed to download ${format.toUpperCase()} file.`;
      toast({
        title: 'Download Failed',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-6xl mx-auto text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchBenchmarks} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CIS Benchmarks Library</h1>
          <p className="text-xl text-muted-foreground">
            Explore over 100 security configuration benchmarks for your technology stack
          </p>
        </div>

        <Card className="mb-8 border-brand-green/20 bg-brand-green/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-brand-green" />
              <span>Latest Updates</span>
            </CardTitle>
            <CardDescription>
              Discover {benchmarks.length} benchmarks updated as of {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Enhanced Security Controls</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Updated password complexity requirements</li>
                  <li>• New multi-factor authentication guidelines</li>
                  <li>• Enhanced logging and monitoring controls</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Platform Updates</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Support for latest OS versions</li>
                  <li>• Cloud-native security configurations</li>
                  <li>• Container security enhancements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search benchmarks by name or platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading benchmarks...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {benchmarks.map((benchmark) => (
                <Card key={benchmark.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{benchmark.category}</Badge>
                      <Badge variant="outline">v{benchmark.version}</Badge>
                    </div>
                    <CardTitle className="text-lg">{benchmark.name}</CardTitle>
                    <CardDescription>{benchmark.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(benchmark.released).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{benchmark.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDownload(benchmark, 'pdf')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownload(benchmark, 'csv')}
                          >
                            CSV
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownload(benchmark, 'json')}
                          >
                            JSON
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(page - 1)}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(page + 1)}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}

        {!loading && benchmarks.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No benchmarks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Benchmarks;