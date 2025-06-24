
import React from "react";
import { Layout } from '@/components/Layout';
import { ImprovedTradeForm } from '@/components/trade-form/ImprovedTradeForm';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

const AddTrade = () => {
  const navigate = useNavigate();

  const handleFormSubmit = () => {
    navigate('/trade-log');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-white">Add Trade</h2>
              <p className="text-slate-400">Log a new trade with comprehensive details and analysis.</p>
            </div>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </div>

        <ImprovedTradeForm 
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default AddTrade;
