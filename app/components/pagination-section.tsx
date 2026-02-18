import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";

interface PaginationSectionProps {
    page: number;
    totalPage: number;
    onChangePage: (page: number) => void;
}

export function PaginationSection({
    page,
    totalPage,
    onChangePage,
}: PaginationSectionProps) {
    const handlePrevious = () => {
        if (page > 1) {
            onChangePage(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPage) {
            onChangePage(page + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const showEllipsis = totalPage > 5;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i}
                            onClick={() => onChangePage(i)}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                );
            }
        } else {
            // Logic for ellipsis
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        isActive={page === 1}
                        onClick={() => onChangePage(1)}
                        className="cursor-pointer"
                    >
                        1
                    </PaginationLink>
                </PaginationItem>,
            );

            if (page > 3) {
                pages.push(<PaginationEllipsis key="ellipsis-start" />);
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPage - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i}
                            onClick={() => onChangePage(i)}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                );
            }

            if (page < totalPage - 2) {
                pages.push(<PaginationEllipsis key="ellipsis-end" />);
            }

            if (totalPage > 1) {
                pages.push(
                    <PaginationItem key={totalPage}>
                        <PaginationLink
                            isActive={page === totalPage}
                            onClick={() => onChangePage(totalPage)}
                            className="cursor-pointer"
                        >
                            {totalPage}
                        </PaginationLink>
                    </PaginationItem>,
                );
            }
        }

        return pages;
    };

    if (totalPage <= 1) return null;

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePrevious}
                        className={
                            page === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                    <PaginationNext
                        onClick={handleNext}
                        className={
                            page === totalPage
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
