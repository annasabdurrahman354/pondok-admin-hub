
import React from 'react';
import { RAB } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';
import { formatPeriode, formatDate, getStatusBadge } from '@/services/formatUtils';
import { FileText, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RABItemProps {
  rab: RAB;
  index?: number;
  onClick?: () => void;
}

const RABItem: React.FC<RABItemProps> = ({ rab, index = 0, onClick }) => {
  const statusBadge = getStatusBadge(rab.status);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-3 rounded-md bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">RAB {formatPeriode(rab.periode_id)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(rab.submit_at)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={statusBadge.className}>
          {statusBadge.label}
        </span>
        {!onClick && (
          <Link to={`/pondok/rab/detail/${rab.id}`}>
            <Button size="sm" variant="ghost">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default RABItem;
