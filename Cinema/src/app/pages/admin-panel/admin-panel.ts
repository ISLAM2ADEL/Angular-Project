import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StatCard } from "../../components/stat-card/stat-card";
import { RouterLink } from "@angular/router";
import { AddMovie } from "../../components/add-movie/add-movie";
import { EditMovie } from "../../components/edit-movie/edit-movie";
import { CommonModule } from "@angular/common";

Chart.register(...registerables);

@Component({
  selector: 'app-admin-panel',
  imports: [StatCard, BaseChartDirective, AddMovie, EditMovie, CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
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

  movies = [
    {
      title: 'Chronicles of Night',
      duration: '142 mins',
      rating: 'PG-13',
      genre: 'Sci-Fi',
      releaseDate: 'Oct 12, 2024',
      status: 'Showing',
      thumbnail: '/spiderman.jpg',
      description: 'A deep dive into the mysteries of the night.',
      showTimes: ['10:00 AM', '04:00 PM']
    },
    {
      title: 'The Silent Echo',
      duration: '118 mins',
      rating: 'R',
      genre: 'Thriller',
      releaseDate: 'Sep 28, 2024',
      status: 'Showing',
      thumbnail: '/spiderman.jpg',
      description: 'The silence holds secrets no one wants to hear.',
      showTimes: ['01:00 PM', '07:00 PM']
    },
    {
      title: 'Skyward Bound',
      duration: '95 mins',
      rating: 'G',
      genre: 'Animation',
      releaseDate: 'Nov 05, 2024',
      status: 'Upcoming',
      thumbnail: '/spiderman.jpg',
      description: 'A journey beyond the clouds.',
      showTimes: ['10:00 AM', '01:00 PM']
    }
  ];

  popularMovies = [
    { title: 'Chronicles of Night', occupancy: 88 },
    { title: 'The Silent Echo', occupancy: 65 },
    { title: 'Midnight Runner', occupancy: 42 },
    { title: 'Galactic Odyssey', occupancy: 30 }
  ];

  showAddMovieModal = false;
  showEditMovieModal = false;
  selectedMovie: any = null;

  openAddMovie() {
    this.showAddMovieModal = true;
  }

  closeAddMovie() {
    this.showAddMovieModal = false;
  }

  openEditMovie(movie: any) {
    this.selectedMovie = { ...movie, name: movie.title }; // Map title to name for the form
    this.showEditMovieModal = true;
  }

  closeEditMovie() {
    this.showEditMovieModal = false;
    this.selectedMovie = null;
  }
}
