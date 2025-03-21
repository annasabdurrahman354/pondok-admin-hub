
import React from 'react';
import { LPJ } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';
import { formatPeriode, formatDate, getStatusBadge } from '@/services/formatUtils';
import { FileText, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LPJItemProps {
  lpj: LPJ;
  index: number;
}

const LPJItem: React.FC<LPJItemProps> = ({ lpj, index }) => {
  const statusBadge = getStatusBadge(lpj.status);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">LPJ {formatPeriode(lpj.periode_id)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(lpj.submit_at)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={statusBadge.className}>
          {statusBadge.label}
        </span>
        <Link to={`/pondok/lpj/detail/${lpj.id}`}>
          <Button size="sm" variant="ghost">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default LPJItem;
