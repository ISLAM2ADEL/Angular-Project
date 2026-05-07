import { Component, inject, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StatCard } from "../../components/stat-card/stat-card";
import { RouterLink } from "@angular/router";
import { AddMovie } from "../../components/add-movie/add-movie";
import { EditMovie } from "../../components/edit-movie/edit-movie";
import { CommonModule } from "@angular/common";
import { Movie } from '../../models/cinema.models';
import { MovieService } from '../../services/movie.service';
import { ToasterService } from '../../services/toaster.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-panel',
  imports: [StatCard, BaseChartDirective, AddMovie, EditMovie, CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  private movieService = inject(MovieService);
  private toaster = inject(ToasterService);

  searchTerm = '';
  showAllMoviesModal = false;

  // Chart configuration
  public doughnutChartLabels: string[] = ['Mobile', 'Web', 'Kiosk'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [45, 40, 15],
        backgroundColor: ['#AA6178', '#713247', '#3B061C'],
        hoverBackgroundColor: ['#C87A91', '#551C31', '#2D0412'],
        borderWidth: 0,
      }
    ]
  };
  public doughnutChartType: 'doughnut' = 'doughnut';
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(59, 6, 28, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        displayColors: false
      }
    },
    cutout: '75%'
  };

  cardsStats: StatCard[] = [
    {
      iconUrl: '/money.svg',
      stat: 'TOTAL REVENUE',
      statNumber: '$124,592',
      statAmount: '+12.5% vs last month',
      upOrDownIconUrl: "/upArrow.svg"
    },
    {
      iconUrl: '/ticket.svg',
      stat: 'BOOKINGS TODAY',
      statNumber: '842',
      statAmount: '+5.2% vs yesterday',
      upOrDownIconUrl: "/upArrow.svg"
    },
    {
      iconUrl: '/user.svg',
      stat: 'ACTIVE USERS',
      statNumber: '3,201',
      statAmount: '-0.8% vs last week',
      upOrDownIconUrl: "/downArrow.svg"
    },
    {
      iconUrl: '/movie.svg',
      stat: 'ACTIVE SHOWS',
      statNumber: '48',
      statAmount: 'All systems nominal',
      upOrDownIconUrl: "/check.svg"
    }
  ];

  movies: Movie[] = [];
  isLoadingMovies = false;

  get filteredMovies(): Movie[] {
    const t = this.searchTerm.trim().toLowerCase();
    if (!t) return this.movies;

    return this.movies.filter((m) => {
      const title = (m.title || '').toLowerCase();
      const rating = (m.rating || '').toLowerCase();
      const language = (m.language || '').toLowerCase();
      const genres = Array.isArray(m.genre) ? m.genre.join(' ').toLowerCase() : '';
      return (
        title.includes(t) ||
        rating.includes(t) ||
        language.includes(t) ||
        genres.includes(t)
      );
    });
  }

  popularMovies = [
    { title: 'Chronicles of Night', occupancy: 88 },
    { title: 'The Silent Echo', occupancy: 65 },
    { title: 'Midnight Runner', occupancy: 42 },
    { title: 'Galactic Odyssey', occupancy: 30 }
  ];

  showAddMovieModal = false;
  showEditMovieModal = false;
  selectedMovie: Movie | null = null;

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.isLoadingMovies = true;
    this.movieService.getAll().subscribe({
      next: (res) => {
        this.movies = res.data || [];
        this.isLoadingMovies = false;
      },
      error: (err) => {
        this.isLoadingMovies = false;
        this.toaster.error(err?.error?.message || 'Failed to load movies.');
      }
    });
  }

  openAddMovie() {
    this.showAddMovieModal = true;
  }

  closeAddMovie() {
    this.showAddMovieModal = false;
  }

  openEditMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.showEditMovieModal = true;
  }

  closeEditMovie() {
    this.showEditMovieModal = false;
    this.selectedMovie = null;
  }

  onSearch(value: string) {
    this.searchTerm = value;
  }

  openAllMovies() {
    this.showAllMoviesModal = true;
  }

  closeAllMovies() {
    this.showAllMoviesModal = false;
  }

  deleteMovie(movie: Movie) {
    if (!movie?._id) return;
    this.movieService.delete(movie._id).subscribe({
      next: () => {
        this.toaster.success(`Movie "${movie.title}" deleted successfully!`);
        this.loadMovies();
      },
      error: (err) => {
        this.toaster.error(err?.error?.message || 'Failed to delete movie.');
      }
    });
  }
}
