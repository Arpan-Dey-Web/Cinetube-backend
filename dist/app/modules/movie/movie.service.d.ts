export declare const MovieService: {
    getAllMoviesFromDB: (query: Record<string, unknown>, userRole?: string) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        data: ({
            id: string;
            createdAt: Date;
            updatedAt: Date;
            duration: string;
            year: string;
            rating: number;
            isPublished: boolean;
            title: string;
            description: string;
            director: string;
            cast: string[];
            genres: string[];
            posterUrl: string;
            backdropUrl: string;
            trailerUrl: string;
            streamingUrl: string | null;
            platform: string | null;
            price: number;
            isTrending: boolean;
        } & {
            status: "FREE" | "PREMIUM";
        })[];
    }>;
    getSingleMovieFromDB: (id: string) => Promise<({
        reviews: ({
            user: {
                id: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            parentId: string | null;
            isApproved: boolean;
            rating: number;
            movieId: string;
            comment: string;
            tags: string[];
            isSpoiler: boolean;
            likes: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        year: string;
        rating: number;
        isPublished: boolean;
        title: string;
        description: string;
        director: string;
        cast: string[];
        genres: string[];
        posterUrl: string;
        backdropUrl: string;
        trailerUrl: string;
        streamingUrl: string | null;
        platform: string | null;
        price: number;
        isTrending: boolean;
    }) | null>;
    getMovieGenresFromDB: () => Promise<{
        name: string;
        count: number;
    }[]>;
    createMovieInDB: (payload: any) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        year: string;
        rating: number;
        isPublished: boolean;
        title: string;
        description: string;
        director: string;
        cast: string[];
        genres: string[];
        posterUrl: string;
        backdropUrl: string;
        trailerUrl: string;
        streamingUrl: string | null;
        platform: string | null;
        price: number;
        isTrending: boolean;
    }>;
    updateMovieInDB: (id: string, payload: any) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        year: string;
        rating: number;
        isPublished: boolean;
        title: string;
        description: string;
        director: string;
        cast: string[];
        genres: string[];
        posterUrl: string;
        backdropUrl: string;
        trailerUrl: string;
        streamingUrl: string | null;
        platform: string | null;
        price: number;
        isTrending: boolean;
    }>;
    deleteMovieFromDB: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        year: string;
        rating: number;
        isPublished: boolean;
        title: string;
        description: string;
        director: string;
        cast: string[];
        genres: string[];
        posterUrl: string;
        backdropUrl: string;
        trailerUrl: string;
        streamingUrl: string | null;
        platform: string | null;
        price: number;
        isTrending: boolean;
    }>;
};
//# sourceMappingURL=movie.service.d.ts.map