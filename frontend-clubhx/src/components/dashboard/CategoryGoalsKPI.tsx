import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressEnhanced } from "@/components/ui/progress-enhanced";
import { Badge } from "@/components/ui/badge";
import { CategoryGoal } from "@/types/vendor";
import { Target, TrendingUp, AlertCircle, Palette, Sparkles, Scissors, Beaker, CheckCircle, Clock, AlertTriangle, Calendar, Trophy } from "lucide-react";
import { formatCurrency } from '@/utils/customerFormatters';
import { calculateCategoriesWithProgress, getProgressColor, getStatusBorderColor } from '@/utils/goalCalculations';

interface CategoryGoalsKPIProps {
  categoryGoals: CategoryGoal[];
  salesByCategory: {
    Color: number;
    Cuidado: number;
    Styling: number;
    Técnico: number;
    Texturización: number;
    Accesorios: number;
  };
}

const categoryIcons = {
  Color: Palette,
  Cuidado: Sparkles,
  Styling: Scissors,
  Técnico: Beaker,
  Texturización: Scissors,
  Accesorios: Target
};

export default function CategoryGoalsKPI({ categoryGoals, salesByCategory }: CategoryGoalsKPIProps) {
  // Calcular progreso para cada categoría usando la utilidad
  const categoriesWithProgress = calculateCategoriesWithProgress(categoryGoals, salesByCategory);

  const categoriesCompleted = categoriesWithProgress.filter(cat => cat.status === 'completed').length;
  const categoriesOnTrack = categoriesWithProgress.filter(cat => cat.status === 'on-track').length;
  const categoriesNearTarget = categoriesWithProgress.filter(cat => cat.status === 'near-target').length;
  const categoriesAtRisk = categoriesWithProgress.filter(cat => cat.status === 'at-risk').length;

  const totalGoalAmount = categoryGoals.reduce((sum, goal) => sum + goal.amount, 0);
  const totalCurrentSales = categoriesWithProgress.reduce((sum, cat) => sum + cat.actualSales, 0);
  const overallProgress = totalGoalAmount > 0 ? (totalCurrentSales / totalGoalAmount) * 100 : 0;
  
  // Determinar el período actual
  const currentDate = new Date();
  const periodText = `${currentDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }).toUpperCase()}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header KPI Summary - Enhanced */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Trophy className="h-7 w-7 text-primary" />
              Mis Metas por Categoría
            </CardTitle>
            <Badge variant="outline" className="text-sm font-medium">
              <Calendar className="h-4 w-4 mr-2" />
              {periodText}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Overall Progress - More prominent */}
            <div className="lg:col-span-2 space-y-4 p-4 bg-white/60 rounded-xl border border-white/80">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Progreso General</h3>
                <span className="text-3xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {overallProgress.toFixed(1)}%
                </span>
              </div>
              <ProgressEnhanced 
                value={Math.min(overallProgress, 100)} 
                status={overallProgress >= 100 ? 'completed' : overallProgress >= 80 ? 'on-track' : overallProgress >= 60 ? 'near-target' : 'at-risk'}
                showGlow={overallProgress >= 80}
                className="h-4"
              />
              <div className="flex justify-between text-sm font-medium">
                <span className="text-primary">ACTUAL: {formatCurrency(totalCurrentSales)}</span>
                <span className="text-gray-600">META: {formatCurrency(totalGoalAmount)}</span>
              </div>
            </div>

            {/* Enhanced Categories Status */}
            <div className="flex items-center gap-4 p-4 bg-goal-completed-bg rounded-xl border border-goal-completed/20">
              <CheckCircle className="h-10 w-10 text-goal-completed flex-shrink-0" />
              <div>
                <p className="text-3xl font-black text-goal-completed">{categoriesCompleted}</p>
                <p className="text-sm font-medium text-gray-600">Cumplidas</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-goal-on-track-bg rounded-xl border border-goal-on-track/20">
              <TrendingUp className="h-10 w-10 text-goal-on-track flex-shrink-0" />
              <div>
                <p className="text-3xl font-black text-goal-on-track">{categoriesOnTrack}</p>
                <p className="text-sm font-medium text-gray-600">En Buen Ritmo</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-goal-at-risk-bg rounded-xl border border-goal-at-risk/20">
              <AlertTriangle className="h-10 w-10 text-goal-at-risk flex-shrink-0" />
              <div>
                <p className="text-3xl font-black text-goal-at-risk">{categoriesAtRisk}</p>
                <p className="text-sm font-medium text-gray-600">En Riesgo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Individual Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
        {categoriesWithProgress.map((category) => {
          const IconComponent = categoryIcons[category.category] || Target;
          
          return (
            <Card 
              key={category.category} 
              className={`group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 border-2 ${getStatusBorderColor(category.status)} overflow-hidden min-w-0`}
            >
              <CardHeader className="pb-4 relative">
                {/* Status indicator glow */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  category.status === 'completed' ? 'bg-goal-completed' :
                  category.status === 'on-track' ? 'bg-goal-on-track' :
                  category.status === 'near-target' ? 'bg-goal-near-target' :
                  'bg-goal-at-risk'
                }`} />
                
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      category.status === 'completed' ? 'bg-goal-completed text-white' :
                      category.status === 'on-track' ? 'bg-goal-on-track text-white' :
                      category.status === 'near-target' ? 'bg-goal-near-target text-white' :
                      'bg-goal-at-risk text-white'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800 truncate">{category.category}</CardTitle>
                      <p className="text-sm text-gray-500 font-medium">Meta Mensual</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-3xl font-black whitespace-nowrap leading-none ${getProgressColor(category.progress)}`}>
                      {category.progress}%
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {category.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-goal-completed" />
                      ) : category.status === 'on-track' ? (
                        <TrendingUp className="w-4 h-4 text-goal-on-track" />
                      ) : category.status === 'near-target' ? (
                        <Clock className="w-4 h-4 text-goal-near-target" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-goal-at-risk" />
                      )}
                      <Badge variant="outline" className={`text-xs font-semibold ${
                        category.status === 'completed' ? 'text-goal-completed border-goal-completed' :
                        category.status === 'on-track' ? 'text-goal-on-track border-goal-on-track' :
                        category.status === 'near-target' ? 'text-goal-near-target border-goal-near-target' :
                        'text-goal-at-risk border-goal-at-risk'
                      }`}>
                        {category.status === 'completed' ? 'CUMPLIDA' :
                         category.status === 'on-track' ? 'EN RITMO' :
                         category.status === 'near-target' ? 'ATENCIÓN' : 'RIESGO'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5">
                {/* Enhanced Progress Bar */}
                <div className="space-y-2">
                  <ProgressEnhanced 
                    value={Math.min(category.progress, 100)} 
                    status={category.status as 'completed' | 'on-track' | 'near-target' | 'at-risk'}
                    showGlow={category.progress >= 80}
                    className="h-4"
                  />
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                {/* Clear Financial Information */}
                <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-100">
                  <dl className="space-y-2">
                    <div className="flex items-center justify-between">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wide">META</dt>
                      <dd className="text-lg font-black text-gray-800 whitespace-nowrap tabular-nums">{formatCurrency(category.amount)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wide">ACTUAL</dt>
                      <dd className="text-lg font-black text-goal-on-track whitespace-nowrap tabular-nums">{formatCurrency(category.actualSales)}</dd>
                    </div>
                    {category.status !== 'completed' ? (
                      <div className="flex items-center justify-between">
                        <dt className="text-xs font-bold text-gray-500 uppercase tracking-wide">FALTAN</dt>
                        <dd className="text-lg font-black text-orange-600 whitespace-nowrap tabular-nums">{formatCurrency(category.remaining)}</dd>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <dt className="text-xs font-bold text-gray-500 uppercase tracking-wide">EXCESO</dt>
                        <dd className="text-lg font-black text-goal-completed whitespace-nowrap tabular-nums">+{formatCurrency(category.actualSales - category.amount)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                {/* Enhanced Status Messages */}
                {category.status === 'completed' && (
                  <div className="p-4 bg-gradient-to-r from-goal-completed-bg to-goal-completed/10 rounded-xl border border-goal-completed/30">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-goal-completed" />
                      <p className="text-sm font-bold text-goal-completed">
                        ¡EXCELENTE! Meta superada por {formatCurrency(category.actualSales - category.amount)}
                      </p>
                    </div>
                  </div>
                )}
                
                {category.status === 'at-risk' && (
                  <div className="p-4 bg-gradient-to-r from-goal-at-risk-bg to-goal-at-risk/10 rounded-xl border border-goal-at-risk/30 animate-pulse">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-goal-at-risk" />
                      <p className="text-sm font-bold text-goal-at-risk">
                        URGENTE: Solo {category.progress}% completado. Requiere acción inmediata.
                      </p>
                    </div>
                  </div>
                )}
                
                {category.status === 'near-target' && (
                  <div className="p-4 bg-gradient-to-r from-goal-near-target-bg to-goal-near-target/10 rounded-xl border border-goal-near-target/30">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-goal-near-target" />
                      <p className="text-sm font-bold text-goal-near-target">
                        ¡Vas bien! Te falta {100 - category.progress}% para cumplir la meta.
                      </p>
                    </div>
                  </div>
                )}

                {category.status === 'on-track' && (
                  <div className="p-4 bg-gradient-to-r from-goal-on-track-bg to-goal-on-track/10 rounded-xl border border-goal-on-track/30">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-goal-on-track" />
                      <p className="text-sm font-bold text-goal-on-track">
                        ¡Perfecto ritmo! Estás en camino a cumplir tu meta.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}