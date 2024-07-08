const { createApp } = Vue;

createApp({
    data() {
        return {
            searchTerm: '',
            searchResults: [],
            displayedArtists: [],
            genres: [],
            selectedGenres: ['ALL'],
            searchMade: false,
            resultCount: 0
          };
        },
        methods: {
          async search() {
            if (this.searchTerm.trim() === '') {
              alert('Please enter a search term.');
              return;
            }
            this.searchMade = true;
            try {
              const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(this.searchTerm)}&entity=musicTrack&limit=50&media=music`);
              console.log(response.data);
              this.searchResults = response.data.results;
              this.displayedArtists = [...this.searchResults];
              this.genres = ['ALL', ...new Set(this.searchResults.map(result => result.primaryGenreName))];
              this.selectedGenres = ['ALL'];
              this.resultCount = this.searchResults.resultCount;
            } catch (error) {
              console.error(error);
                alert("No artist was found with the keyword.");
            }
        },
        filterByGenre(genre) {
          if (genre === 'ALL') {
            this.selectedGenres = ['ALL'];
          } else {
            const allIndex = this.selectedGenres.indexOf('ALL');
            if (allIndex !== -1) {
              this.selectedGenres.splice(allIndex, 1); 
            }
        
            const genreIndex = this.selectedGenres.indexOf(genre);
            if (genreIndex === -1) {
              this.selectedGenres.push(genre);
            } else {
              this.selectedGenres.splice(genreIndex, 1); 
            }
        
            if (this.selectedGenres.length === 0) {
              this.selectedGenres.push('ALL');
            }
          }
          this.updateDisplayedArtists();
        },
        updateDisplayedArtists() {
          if (this.selectedGenres.includes('ALL')) {
            this.displayedArtists = [...this.searchResults];
          } else {
            this.displayedArtists = [...this.searchResults.filter(artist => 
              this.selectedGenres.includes(artist.primaryGenreName)
            )];
          }
        },
        sortResults(key) {
            if (key === 'original') {
                this.updateDisplayedArtists();
            } else {
                this.displayedArtists.sort((a, b) => {
                    if (key === 'collectionName') {
                        return a.collectionName?.localeCompare(b.collectionName);
                    } else if (key === 'price') {
                        return a.collectionPrice - b.collectionPrice;
                    }
                });
            }
        },
        isGenreSelected(genre) {
          return this.selectedGenres.includes(genre);
        },
        genreButtonClass(genre) {
          if (genre === 'ALL') {
            return this.isGenreSelected(genre) ? 'btn-success' : 'btn-outline-success';
          }
          return this.isGenreSelected(genre) ? 'btn-primary' : 'btn-outline-primary';
        }
    }
}).mount('#app');