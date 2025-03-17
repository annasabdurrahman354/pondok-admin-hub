
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ApprovalAlert: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="flex items-center gap-3 py-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div className="flex-1">
            <p className="text-amber-800 font-medium">Data pondok menunggu persetujuan admin yayasan</p>
            <p className="text-amber-700 text-sm">Beberapa fitur dibatasi sampai data disetujui</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApprovalAlert;
