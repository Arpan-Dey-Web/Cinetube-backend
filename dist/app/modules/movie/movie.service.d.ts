import { Movie } from "../../../generated/client";
export declare const MovieService: {
    getAllMoviesFromDB: (query: Record<string, any>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            director: string;
            cast: string[];
            year: string;
            duration: string;
            rating: number;
            genres: string[];
            posterUrl: string;
            backdropUrl: string;
            trailerUrl: string;
            streamingUrl: string | null;
            platform: string | null;
            status: import("../../../generated/enums").ContentStatus;
            price: number;
            isPublished: boolean;
            isTrending: boolean;
        }[];
    }>;
    getSingleMovieFromDB: (id: string) => Promise<({
        reviews: ({
            user: {
                name: string;
                image: string | null;
                role: import("../../../generated/enums").Role;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            userId: string;
            movieId: string;
            isApproved: boolean;
            likes: number;
            comment: string;
            isSpoiler: boolean;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        director: string;
        cast: string[];
        year: string;
        duration: string;
        rating: number;
        genres: string[];
        posterUrl: string;
        backdropUrl: string;
        trailerUrl: string;
        streamingUrl: string | null;
        platform: string | null;
        status: import("../../../generated/enums").ContentStatus;
        price: number;
        isPublished: boolean;
        isTrending: boolean;
    }) | null>;
    createMovieInDB: (movieData: Partial<Movie>) => Promise<Movie>;
    updateMovieInDB: (id: string, payload: Partial<Movie>) => Promise<Movie>;
    deleteMovieFromDB: (id: string) => Promise<Movie>;
};
//# sourceMappingURL=movie.service.d.ts.map