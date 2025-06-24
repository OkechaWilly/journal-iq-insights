
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">404</CardTitle>
          <p className="text-slate-400">Page not found</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-slate-300 mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-slate-500">
              Attempted to access: <code className="bg-slate-700 px-2 py-1 rounded text-slate-300">{location.pathname}</code>
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Need help? Check out the{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-400 hover:text-blue-300"
                onClick={() => navigate('/trades')}
              >
                trades page
              </Button>{' '}
              or{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-400 hover:text-blue-300"
                onClick={() => navigate('/add-trade')}
              >
                add a new trade
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
